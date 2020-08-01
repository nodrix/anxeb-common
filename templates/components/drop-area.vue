<div v-on:dragenter.prevent="enter" v-on:dragleave.prevent="leave" @dragover.prevent v-on:drop.prevent="dropped" ref="zone" v-bind="$attrs" class="app-drag-area" :class="{'app-drag-area-hover' : dragging}" :style="{height: ($root.screen.height - 290) + 'px'}">
	<div class="_watermark" v-if="dragging">
		<div class="_container">
			<i class="fa fa-plus-circle"></i>
		</div>
	</div>
	<slot name="content" v-bind:actions="{}"></slot>
</div>