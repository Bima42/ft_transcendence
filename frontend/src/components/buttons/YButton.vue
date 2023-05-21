<template>
	<div class="all-wrap">
		<div class="all">
			<div class="yarn"></div>
			<div class="cat-wrap">
				<div class="cat">
					<div class="cat-upper">
						<div class="cat-leg"></div>
						<div class="cat-leg"></div>
						<div class="cat-head">
							<div class="cat-ears">
								<div class="cat-ear"></div>
								<div class="cat-ear"></div>
							</div>
							<div class="cat-face">
								<div class="cat-eyes"></div>
								<div class="cat-mouth"></div>
								<div class="cat-whiskers"></div>
							</div>
						</div>
					</div>
					<div class="cat-lower-wrap">
						<div class="cat-lower">
							<div class="cat-leg">
								<div class="cat-leg">
									<div class="cat-leg">
										<div class="cat-leg">
											<div class="cat-leg">
												<div class="cat-leg">
													<div class="cat-leg">
														<div class="cat-leg">
															<div class="cat-leg">
																<div class="cat-leg">
																	<div class="cat-leg">
																		<div class="cat-leg">
																			<div class="cat-leg">
																				<div class="cat-leg">
																					<div class="cat-leg">
																						<div class="cat-leg">
																							<div class="cat-paw"></div>
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="cat-leg">
								<div class="cat-leg">
									<div class="cat-leg">
										<div class="cat-leg">
											<div class="cat-leg">
												<div class="cat-leg">
													<div class="cat-leg">
														<div class="cat-leg">
															<div class="cat-leg">
																<div class="cat-leg">
																	<div class="cat-leg">
																		<div class="cat-leg">
																			<div class="cat-leg">
																				<div class="cat-leg">
																					<div class="cat-leg">
																						<div class="cat-leg">
																							<div class="cat-paw"></div>
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="cat-tail">
								<div class="cat-tail">
									<div class="cat-tail">
										<div class="cat-tail">
											<div class="cat-tail">
												<div class="cat-tail">
													<div class="cat-tail">
														<div class="cat-tail">
															<div class="cat-tail">
																<div class="cat-tail">
																	<div class="cat-tail">
																		<div class="cat-tail">
																			<div class="cat-tail">
																				<div class="cat-tail">
																					<div class="cat-tail">
																						<div
																							class="cat-tail -end"></div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
$color-bg: #1F1F3C;
$color-fur-light: #D5E8F8;
$color-fur-dark: #8B9BD9;
$color-features: #4B4D75;
$color-features-light: #9FA2CB;
$color-yarn: $tertiary;
$duration: 7s;
$easing: cubic-bezier(0.5, 0, 0.5, 1);
$offset: .5s;
$swings: 5 -10 10 -15 23 -23 15 -10 5;
$total-swings: length($swings);

.all-wrap {
	animation: bob $duration $easing infinite both;
}

.all {
	position: absolute;
	width: 5rem;
	height: 5rem;
	transform-origin: center -40rem;
	animation: swing $duration $easing infinite both;

	&:before {
		height: 40rem;
		width: 2px;
		background-color: $color-yarn;
		left: calc(50% - 1px);
		bottom: 40rem;
	}
}

.yarn {
	position: absolute;
	top: 0;
	left: 0;
	width: 80px;
	height: 80px;
	border-radius: 50%;
	background-image: radial-gradient(circle at top left,
		lighten($color-yarn, 20%),
		$color-yarn 50%,
		darken($color-yarn, 10%));
	z-index: 1;

	&:before, &:after {
		position: absolute;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: white;
		top: -1px;
	}

	&:before {
		left: calc(50% + 7px);
		background-color: lighten($color-fur-dark, 10%);
	}

	&:after {
		right: calc(50% + 7px);
		background-color: $color-fur-light;
	}
}

.cat-wrap {
	position: absolute;
	top: 0;
	left: calc(50% - 45px);
	width: 90px;
	height: 130px;
	animation: reverse-swing $duration $easing infinite both; // cancel swing
	transform-origin: top center;
}

.cat {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	animation: swing $duration .2s infinite both;
	transform-origin: top center;
}

.cat-upper {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	transform-origin: top center;
	z-index: 1;

	.cat-leg {
		position: absolute;
		width: 20px;
		height: 100%;
		background-color: white;
		z-index: -1;
		background-image: linear-gradient(to right,
			$color-fur-light,
			$color-fur-light 20%,
			$color-fur-dark);

		&:nth-child(1) {
			border-top-left-radius: 100px;
			left: 10px;

			&:after {
				left: 50%;
			}
		}

		&:nth-child(2) {
			border-top-left-radius: 0;
			border-top-right-radius: 100px;
			right: 10px;

			&:after {
				right: 50%;
			}
		}
	}
}

.cat-lower-wrap {
	height: 90%;
	width: 100%;
	position: absolute;
	top: 100%;
	width: 75px;
	left: calc(50% - 37.5px);
	animation: reverse-swing $duration .2s infinite both; // cancel swing
	transform-origin: top center;
}

.cat-lower {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	animation: swing $duration .5s infinite both;
	transform-origin: top center;

	&:after {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 100px;
		background-image: radial-gradient(circle at 10px 50px,
			white,
			white 40%,
			$color-fur-light 65%,
			$color-fur-dark);
		z-index: 1;
	}

	.cat-leg, .cat-paw {
		z-index: -1;
		position: absolute;
		height: 20px;
		width: 20px;
		animation: swing-leg $duration .3s infinite both;
		z-index: 1;
		transform-origin: top center;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		background-image: linear-gradient(to right,
			white,
			$color-fur-light,
			$color-fur-dark);
	}

	> .cat-leg {
		bottom: 20px;

		.cat-leg {
			top: 25%;
		}

		+ .cat-leg {
			right: 0;
		}
	}

	.cat-paw {
		top: 50%;
		border-radius: 50%;
		background-color: #fff;
	}

	.cat-tail {
		position: absolute;
		height: 15px;
		width: 10px;
		animation: swing-tail $duration $easing infinite both;
		transform-origin: top center;
		z-index: 0;
		background-image: linear-gradient(to right,
			white,
			$color-fur-light,
			$color-fur-dark);
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;

		> .cat-tail {
			top: 50%;
		}
	}

	> .cat-tail {
		left: calc(50% - 5px);
		top: 95%;
	}
}

.cat-head {
	width: 90px;
	height: 90px;
	background-image: radial-gradient(circle at 10px 10px,
		white,
		white 40%,
		$color-fur-light 65%,
		$color-fur-dark);
	border-radius: 50%;
	top: calc(100% - 45px);
}

.cat-face {
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	animation: face $duration $easing infinite both;
	transform-style: preserve-3d;
	perspective: 100px;
}

.cat-ears {
	position: absolute;
	top: 0;
	left: 0;
	height: 50%;
	width: 100%;
	z-index: -1;
}

.cat-ear {
	width: 20px;
	height: 100%;
	position: absolute;
	border-radius: 5px;
	top: -10px;

	&:first-child {
		left: 0;
		transform-origin: top left;
		transform: skewY(40deg);
		background-color: white;

		&:before {
			left: 0;
			border-top-right-radius: 50%;
			border-bottom-right-radius: 50%;
			background-color: #D7EBFB;
		}
	}

	&:last-child {
		right: 0;
		transform-origin: top right;
		transform: skewY(-40deg);
		background-color: darken($color-fur-light, 1%);

		&:before {
			right: 0;
			border-top-left-radius: 50%;
			border-bottom-left-radius: 50%;
			background-color: lighten(#D7EBFB, 2%);
		}
	}

	&:before {
		width: 60%;
		height: 100%;
		top: 10px;
		position: absolute;
		background-color: #fff;
	}
}

.cat-eyes {
	position: absolute;
	top: 50%;
	width: 100%;
	height: 6px;
	animation: blink $duration step-end infinite both;

	&:before, &:after {
		position: absolute;
		height: 6px;
		width: 6px;
		border-radius: 50%;
		background-color: $color-features;
	}

	&:before {
		left: 20px;
	}

	&:after {
		right: 20px;
	}
}

.cat-mouth {
	position: absolute;
	width: 12px;
	height: 8px;
	background-color: $color-features;
	top: 60%;
	left: calc(50% - 6px);
	border-top-left-radius: 50% 30%;
	border-top-right-radius: 50% 30%;
	border-bottom-left-radius: 50% 70%;
	border-bottom-right-radius: 50% 70%;
	transform: translateZ(10px);

	&:before, &:after {
		position: absolute;
		width: 90%;
		height: 100%;
		border: 2px solid $color-features-light;
		top: 80%;
		border-radius: 100px;
		border-top-color: transparent;
		z-index: -1;
	}

	&:before {
		border-left-color: transparent;
		right: calc(50% - 1px);
		transform-origin: top right;
		transform: rotate(10deg);
	}

	&:after {
		border-right-color: transparent;
		left: calc(50% - 1px);
		transform-origin: top left;
		transform: rotate(-10deg);
	}
}

.cat-whiskers {
	width: 50%;
	height: 8px;
	position: absolute;
	bottom: 25%;
	left: 25%;
	transform-style: preserve-3d;
	perspective: 60px;

	&:before, &:after {
		position: absolute;
		height: 100%;
		width: 30%;
		border: 2px solid $color-features-light;
		border-left: none;
		border-right: none;
	}

	&:before {
		right: 100%;
		transform-origin: right center;
		transform: rotateY(70deg) rotateZ(-10deg);
	}

	&:after {
		left: 100%;
		transform-origin: left center;
		transform: rotateY(-70deg) rotateZ(10deg);
	}
}

@function swing-rotate($val) {
	@return rotate($val * 1deg);
}

@function swing-face($val) {
	@return translateX($val * 1px);
}

@mixin swing($mult: 1, $fn: swing-rotate) {
	@for $i from 1 through $total-swings {
		$swing: nth($swings, $i);
		$kfr: ($i - 1) / ($total-swings - 1);

		#{percentage($kfr)} {
			transform: call($fn, $swing * $mult);
		}
	}
}

@keyframes bob {
	$down: true;
	@for $i from 1 through $total-swings * 2 - 1 {
		// $swing: nth($swings, $i);
		$kfr: ($i - 1) / ($total-swings * 2 - 1 - 1);
		$delta: .4rem;
		$distance: $delta;
		@if ($down) {
			$down: false;
			$distance: $delta;
		} @else {
			$down: true;
			$distance: -$delta;
		}

		#{percentage($kfr)} {
			transform: translateY($distance);
		}
	}
}

@keyframes swing {
	@include swing();
}

@keyframes swing-leg {
	@include swing(.1);
}

@keyframes swing-tail {
	@include swing(-.4);
}

@keyframes reverse-swing {
	@include swing(-1);
}

@keyframes face {
	@include swing(-.5, swing-face);
}

@keyframes fade-in {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes blink {
	from, to, 10%, 25%, 80% {
		transform: scaleY(1);
	}
	8%, 23%, 78% {
		transform: scaleY(0.1);
	}
}

body, html {
	height: 100%;
	width: 100%;
	margin: 0;
	padding: 0;
	background-color: $color-bg;
	overflow: hidden;
}

*, *:before, *:after {
	box-sizing: border-box;
	position: relative;
	animation-timing-function: $easing;
	animation-fill-mode: both;
}

*:before, *:after {
	content: '';
	display: block;
}
</style>