<template>
    <section class="list_container">
        <ul class="commands" v-if="!props.isUserBanned">
            <li
                v-for="(command, x) in commands"
                class="command"
                :key="x"
                :id="command.command"
                @click="handleClick(command.command)"
            >
                {{ command.command }}
            </li>
        </ul>
        <ul class="commands" v-else>
            <li
                class="command"
                :id="'unban'"
                @click="handleClick('unban')"            >
                Unban
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    setSelectedCommand: (command: string) => void
    isUserBanned: boolean
}>()

const handleClick = (command: string) => {
    let newSelection = document.getElementById(command) as HTMLElement
    let oldSelection = document.getElementsByClassName('selected_command')[0] as HTMLElement
    if (oldSelection) {
        oldSelection.classList.remove('selected_command')
    }
    if (newSelection) {
        newSelection.classList.add('selected_command')
    }
    props.setSelectedCommand(command)
}

const commands = ref(
    [{
        'command': 'kick',
        'description': 'Kick a user from the channel'
    },
    {
        'command': 'ban',
        'description': 'Ban a user from the channel'
    },
    {
        'command': 'mute',
        'description': 'Mute the user for a while'
    },
    {
        'command': 'promote',
        'description': 'Promote a user to administrator'
    },
    {
        'command': 'demote',
        'description': 'Demotes an admin to user'
    }]
);

</script>

<style scoped lang="scss">
.list_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 300px;
    width: 100%;
    border: 2px solid $tertiary;

    .commands {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        overflow: auto;

        .command {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 10px;
            border: 1px solid $tertiary;
            background: $secondary;
            cursor: pointer;

            &.selected_command {
                background: $tertiary;
            }
        }
    }
}
</style>