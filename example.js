// =============================================================================
//  An Entity in the world.
// =============================================================================
var Entity = function() {
  this.x = 0;
  this.speed = 2; // units/s
  this.position_buffer = [];
}

// Apply user's input to this entity.
Entity.prototype.applyInput = function(input) {
  this.x += input.press_time*this.speed;
}


// =============================================================================
//  A message queue with simulated network lag.
// =============================================================================
var LagNetwork = function() {
  this.messages = [];
}

// "Send" a message. Store each message with the timestamp when it should be
// received, to simulate lag.
LagNetwork.prototype.send = function(lag_ms, message) {
  this.messages.push({recv_ts: +new Date() + lag_ms,
                      payload: message});
}

// Returns a "received" message, or undefined if there are no messages available
// yet.
LagNetwork.prototype.receive = function() {
  var now = +new Date();
  for (var i = 0; i < this.messages.length; i++) {
    var message = this.messages[i];
    if (message.recv_ts <= now) {
      this.messages.splice(i, 1);
      return message.payload;
    }
  }
}


// =============================================================================
//  The Client.
// =============================================================================
var Client = function(canvas, status) {
  // Local representation of the entities.
  this.entities = {};

  // Input state.
  this.key_left = false;
  this.key_right = false;

  // Simulated network connection.
  this.network = new LagNetwork();
  this.server = null;
  this.lag = 0;

  // Unique ID of our entity. Assigned by Server on connection.
  this.entity_id = null;

  // Data needed for reconciliation.
  this.client_side_prediction = false;
  this.server_reconciliation = false;
  this.input_sequence_number = 0;
  this.pending_inputs = [];

  // Entity interpolation toggle.
  this.entity_interpolation = true;

  // UI.
  this.canvas = canvas;
  this.status = status;

  // Update rate.
  this.setUpdateRate(50);
}


Client.prototype.setUpdateRate = function(hz) {
  this.update_rate = hz;

  clearInterval(this.update_interval);
  this.update_interval = setInterval(
    (function(self) { return function() { self.update(); }; })(this),
    1000 / this.update_rate);
}


// Update Client state.
Client.prototype.update = function() {
  // Listen to the server.
  this.processServerMessages();

  if (this.entity_id == null) {
    return;  // Not connected yet.
  }

  // Process inputs.
  this.processInputs();

  // Interpolate other entities.
  if (this.entity_interpolation) {
    this.interpolateEntities();
  }

  // Render the World.
  renderWorld(this.canvas, this.entities);

  // Show some info.
  var info = "Non-acknowledged inputs: " + this.pending_inputs.length;
  this.status.textContent = info;
}


// Get inputs and send them to the server.
// If enabled, do client-side prediction.
Client.prototype.processInputs = function() {
  // Compute delta time since last update.
  var now_ts = +new Date();
  var last_ts = this.last_ts || now_ts;
  var dt_sec = (now_ts - last_ts) / 1000.0;
  this.last_ts = now_ts;

  // Package player's input.
  var input;
  if (this.key_right) {
    input = { press_time: dt_sec };
  } else if (this.key_left) {
    input = { press_time: -dt_sec };
  } else {
    // Nothing interesting happened.
    return;
  }

  // Send the input to the server.
  input.input_sequence_number = this.input_sequence_number++;
  input.entity_id = this.entity_id;
  this.server.network.send(this.lag, input);

  // Do client-side prediction.
  if (this.client_side_prediction) {
    this.entities[this.entity_id].applyInput(input);
  }

  // Save this input for later reconciliation.
  this.pending_inputs.push(input);
}


// Process all messages from the server, i.e. world updates.
// If enabled, do server reconciliation.
Client.prototype.processServerMessages = function() {
  while (true) {
    var message = this.network.receive();
    if (!message) {
      break;
    }

    // World state is a list of entity states.
    for (var i = 0; i < message.length; i++) {
      var state = message[i];

      // If this is the first time we see this entity, create a local representation.
      if (!this.entities[state.entity_id]) {
        var entity = new Entity();
        entity.entity_id = state.entity_id;
        this.entities[state.entity_id] = entity;
      }

      var entity = this.entities[state.entity_id];

      if (state.entity_id == this.entity_id) {
        // Received the authoritative position of this client's entity.
        entity.x = state.position;

        if (this.server_reconciliation) {
          // Server Reconciliation. Re-apply all the inputs not yet processed by
          // the server.
          var j = 0;
          while (j < this.pending_inputs.length) {
            var input = this.pending_inputs[j];
            if (input.input_sequence_number <= state.last_processed_input) {
              // Already processed. Its effect is already taken into account into the world update
              // we just got, so we can drop it.
              this.pending_inputs.splice(j, 1);
            } else {
              // Not processed by the server yet. Re-apply it.
              entity.applyInput(input);
              j++;
            }
          }
        } else {
          // Reconciliation is disabled, so drop all the saved inputs.
          this.pending_inputs = [];
        }
      } else {
        // Received the position of an entity other than this client's.

        if (!this.entity_interpolation) {
          // Entity interpolation is disabled - just accept the server's position.
          entity.x = state.position;
        } else {
          // Add it to the position buffer.
          var timestamp = +new Date();
          entity.position_buffer.push([timestamp, state.position]);
        }
      }
    }
  }
}


Client.prototype.interpolateEntities = function() {
  // Compute render timestamp.
  var now = +new Date();
  var render_timestamp = now - (1000.0 / server.update_rate);

  for (var i in this.entities) {
    var entity = this.entities[i];

    // No point in interpolating this client's entity.
    if (entity.entity_id == this.entity_id) {
      continue;
    }

    // Find the two authoritative positions surrounding the rendering timestamp.
    var buffer = entity.position_buffer;

    // Drop older positions.
    while (buffer.length >= 2 && buffer[1][0] <= render_timestamp) {
      buffer.shift();
    }

    // Interpolate between the two surrounding authoritative positions.
    if (buffer.length >= 2 && buffer[0][0] <= render_timestamp && render_timestamp <= buffer[1][0]) {
      var x0 = buffer[0][1];
      var x1 = buffer[1][1];
      var t0 = buffer[0][0];
      var t1 = buffer[1][0];

      entity.x = x0 + (x1 - x0) * (render_timestamp - t0) / (t1 - t0);
    }
  }
}


// =============================================================================
//  The Server.
// =============================================================================
var Server = function(canvas, status) {
  // Connected clients and their entities.
  this.clients = [];
  this.entities = [];

  // Last processed input for each client.
  this.last_processed_input = [];

  // Simulated network connection.
  this.network = new LagNetwork();

  // UI.
  this.canvas = canvas;
  this.status = status;

  // Default update rate.
  this.setUpdateRate(10);
}

Server.prototype.connect = function(client) {
  // Give the Client enough data to identify itself.
  client.server = this;
  client.entity_id = this.clients.length;
  this.clients.push(client);

  // Create a new Entity for this Client.
  var entity = new Entity();
  this.entities.push(entity);
  entity.entity_id = client.entity_id;

  // Set the initial state of the Entity (e.g. spawn point)
  var spawn_points = [4, 6];
  entity.x = spawn_points[client.entity_id];
}

Server.prototype.setUpdateRate = function(hz) {
  this.update_rate = hz;

  clearInterval(this.update_interval);
  this.update_interval = setInterval(
    (function(self) { return function() { self.update(); }; })(this),
    1000 / this.update_rate);
}

Server.prototype.update = function() {
  this.processInputs();
  this.sendWorldState();
  renderWorld(this.canvas, this.entities);
}


// Check whether this input seems to be valid (e.g. "make sense" according
// to the physical rules of the World)
Server.prototype.validateInput = function(input) {
  if (Math.abs(input.press_time) > 1/40) {
    return false;
  }
  return true;
}


Server.prototype.processInputs = function() {
  // Process all pending messages from clients.
  while (true) {
    var message = this.network.receive();
    if (!message) {
      break;
    }

    // Update the state of the entity, based on its input.
    // We just ignore inputs that don't look valid; this is what prevents clients from cheating.
    if (this.validateInput(message)) {
      var id = message.entity_id;
      this.entities[id].applyInput(message);
      this.last_processed_input[id] = message.input_sequence_number;
    }

  }

  // Show some info.
  var info = "Last acknowledged input: ";
  for (var i = 0; i < this.clients.length; ++i) {
    info += "Player " + i + ": #" + (this.last_processed_input[i] || 0) + "   ";
  }
  this.status.textContent = info;
}


// Send the world state to all the connected clients.
Server.prototype.sendWorldState = function() {
  // Gather the state of the world. In a real app, state could be filtered to avoid leaking data
  // (e.g. position of invisible enemies).
  var world_state = [];
  var num_clients = this.clients.length;
  for (var i = 0; i < num_clients; i++) {
    var entity = this.entities[i];
    world_state.push({entity_id: entity.entity_id,
                      position: entity.x,
                      last_processed_input: this.last_processed_input[i]});
  }

  // Broadcast the state to all the clients.
  for (var i = 0; i < num_clients; i++) {
    var client = this.clients[i];
    client.network.send(client.lag, world_state);
  }
}


// =============================================================================
//  Helpers.
// =============================================================================

// Render all the entities in the given canvas.
var renderWorld = function(canvas, entities) {
  // Clear the canvas.
  canvas.width = canvas.width;

  var colours = ["blue", "red"];

  for (var i in entities) {
    var entity = entities[i];

    // Compute size and position.
    var radius = canvas.height*0.9/2;
    var x = (entity.x / 10.0)*canvas.width;

    // Draw the entity.
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(x, canvas.height / 2, radius, 0, 2*Math.PI, false);
    ctx.fillStyle = colours[entity.entity_id];
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "dark" + colours[entity.entity_id];
    ctx.stroke();
  }
}


var element = function(id) {
  return document.getElementById(id);
}

// =============================================================================
//  Get everything up and running.
// =============================================================================

// World update rate of the Server.
var server_fps = 4;


// Update simulation parameters from UI.
var updateParameters = function() {
  updatePlayerParameters(player1, "player1");
  updatePlayerParameters(player2, "player2");
  server.setUpdateRate(updateNumberFromUI(server.update_rate, "server_fps"));
  return true;
}


var updatePlayerParameters = function(client, prefix) {
  client.lag = updateNumberFromUI(player1.lag, prefix + "_lag");

  var cb_prediction = element(prefix + "_prediction");
  var cb_reconciliation = element(prefix + "_reconciliation");

  // Client Side Prediction disabled => disable Server Reconciliation.
  if (client.client_side_prediction && !cb_prediction.checked) {
    cb_reconciliation.checked = false;
  }

  // Server Reconciliation enabled => enable Client Side Prediction.
  if (!client.server_reconciliation && cb_reconciliation.checked) {
    cb_prediction.checked = true;
  }

  client.client_side_prediction = cb_prediction.checked;
  client.server_reconciliation = cb_reconciliation.checked;

  client.entity_interpolation = element(prefix + "_interpolation").checked;
}


var updateNumberFromUI = function(old_value, element_id) {
  var input = element(element_id);
  var new_value = parseInt(input.value);
  if (isNaN(new_value)) {
    new_value = old_value;
  }
  input.value = new_value;
  return new_value;
}


// When the player presses the arrow keys, set the corresponding flag in the client.
var keyHandler = function(e) {
  e = e || window.event;
  if (e.keyCode == 39) {
    player1.key_right = (e.type == "keydown");
  } else if (e.keyCode == 37) {
    player1.key_left = (e.type == "keydown");
  } else if (e.key == 'd') {
    player2.key_right = (e.type == "keydown");
  } else if (e.key == 'a') {
    player2.key_left = (e.type == "keydown");
  } else {
    console.log(e)
  }
}
document.body.onkeydown = keyHandler;
document.body.onkeyup = keyHandler;


// Setup a server, the player's client, and another player.
var server = new Server(element("server_canvas"), element("server_status"));
var player1 = new Client(element("player1_canvas"), element("player1_status"));
var player2 = new Client(element("player2_canvas"), element("player2_status"));


// Connect the clients to the server.
server.connect(player1);
server.connect(player2);


// Read initial parameters from the UI.
updateParameters();
