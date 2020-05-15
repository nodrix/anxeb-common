<div class="_group app-actions-button" v-if="layout === 'toolbar'" :class="{'app-disabled' : enabled === false}">
	<button ref="btn" v-on:click.stop="toggle()">
		<i class="fas" :class="[icon, (active === true ? 'app-terminal-active-color' : null)]"></i><span>${title}</span>
	</button>

	<div ref="box" class="_actions" v-show="visible" v-if="$slots.options !== undefined">
		<div class="dropdown-menu" v-on:click="toggle(false)">
			<slot name="options"></slot>
		</div>
	</div>
</div>
<div v-else class="app-actions-container">
	<div class="app-actions-button">
		<button ref="btn" v-on:click.stop="toggle()">
			${title}
		</button>
		<div ref="box" class="_actions" v-show="visible" v-if="$slots.options !== undefined">
			<div class="dropdown-menu" v-on:click="toggle(false)">
				<slot name="options"></slot>
			</div>
		</div>
	</div>
</div>