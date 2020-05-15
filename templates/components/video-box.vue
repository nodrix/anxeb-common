<div class="video-box-container" :style="{'width': size.width || '100%', 'height': size.height, 'border-radius' : radius || '10px'}" ref="container">
	<div class="_frame">
		<div v-if="state.video && state.failed" class="video-box-floated">
			<div class="video-box-failed" :style="{'border-radius' : radius || '10px'}">
				<i class="fa fa-exclamation-triangle text-danger" :style="{'font-size': iconSize}"></i>
			</div>
		</div>

		<div v-else-if="state.busy" class="video-box-floated">
			<div class="video-box-busy" :style="{'border-radius' : radius || '10px'}">
				<i class="fas fa-circle-notch fa-spin" :style="{'font-size': iconSize}"></i>
			</div>
		</div>

		<div v-else-if="!state.video" class="video-box-floated">
			<div class="video-box-standby" :style="{'border-radius' : radius || '10px'}">
				<i v-on:click="toggle ? toggle() : null" class="fa fa-video" :style="{'font-size': iconSize, 'color': iconColor}"></i>
			</div>
		</div>
		<video v-on:click="toggle ? toggle() : null" v-show="state.video" class="video-box-element" :class="{'video-box-inverted' : inverted === true || inverted === 'true'}" :style="{'border-radius' : radius || '10px'}" ref="video"></video>

		<div v-if="state.video && audioToggler" class="video-box-floated" v-on:click="toggleAudio()">
			<div v-if="state.muted" class="video-box-action" :style="{'border-radius' : radius || '10px'}">
				<i :style="{'font-size': iconSize}" class="fa" :class="{'fa-volume-mute' : state.muted}"></i>
			</div>
		</div>

		<div class="video-box-floated" v-show="levels === true || levels === 'true'">
			<canvas style="width: 100%; height: 20%; bottom: 0; position: absolute" ref="canvas">
			</canvas>
		</div>

		<div class="video-box-floated" v-if="controls !== false">
			<div :style="{width: (loudness * 0.5) + '%'}" style="height: 3px; bottom: 20px; max-width: 100%; position: absolute; background-color: rgba(255,26,26,0.78)">
			</div>
		</div>

		<div class="video-box-floated" style="z-index: 10000" v-if="controls !== false && state.video">
			<div class="video-box-bar">
				<div class="_caption">
				</div>
				<div class="_controls">
					<i v-if="reset" v-on:click="reset()" class="fa fa-sync"></i>
					<i v-on:click="toggleVideo()" class="fa" :class="{'fa-video-slash' : state.paused, 'fa-video' : !state.paused}"></i>
					<i v-on:click="toggleAudio()" class="fa" :class="{'fa-volume-mute' : state.muted, 'fa-volume-up' : !state.muted}"></i>
				</div>
			</div>
		</div>

		<div class="video-box-floated" v-if="caption != null && state.video">
			<div class="video-box-top">
				<div class="_caption"><span>${caption}</span></div>
				<div class="_states">
				</div>
			</div>
		</div>
	</div>
</div>