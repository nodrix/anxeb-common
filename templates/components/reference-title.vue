<div v-if="layout === 'header'" class="app-terminal-total-title-header" :class="{'app-termina-touch' : action != null && prefixIcon == null}" :style="{'background-color' : bgColor, width: width}" v-on:click="prefixIcon == null ? runAction() : null">
	<div class="app-terminal-total-title">
		<div class="_caption" :style="{'color' : labelColor, 'border-color' : labelColor}">${label}</div>
		<div class="_value">
			<div class="app-total-title-actions-container" v-if="prefixIcon != null && options != null">
				<div class="app-total-title-actions-button">
					<div ref="box" class="_actions" v-show="optionsVisible" v-if="options != null">
						<div class="dropdown-menu">
							<a v-for="option in options"v-on:click="selectActionOption(option)">${option.label}</a>
						</div>
					</div>
					<i v-on:click="toggle()" class="_icon fa fa-plus-circle pull-left" :style="{'color' : valueColor}"></i>
				</div>
			</div>

			<i v-on:click="prefixIcon != null ? runAction() : null" v-if="prefixIcon != null && options == null" class="_icon fa fa-plus-circle pull-left" :style="{'color' : valueColor}"></i>

			<span class="_prefix" :style="{'color' : valueColor}" v-if="prefix">${prefix}</span>
			<span class="_integers" :style="{'color' : valueColor}">${display}</span>
		</div>
	</div>
</div>
<div v-else-if="layout === 'contained'" class="app-terminal-total-title-contained" :class="{'app-termina-touch' : action != null}" :style="{'background-color' : bgColor, width: width}" v-on:click="runAction">
	<div class="app-terminal-total-title">
		<div class="_caption" :style="{'color' : labelColor, 'border-color' : labelColor}">${label}</div>
		<div class="_value">
			<span class="_prefix" :style="{'color' : valueColor}" v-if="prefix">${prefix}</span>
			<span class="_integers" :class="{'_longer' : display != null && display.length > 12}" :style="{'color' : valueColor}">${display}</span>
		</div>
	</div>
</div>
<div v-else class="app-terminal-total-title" v-on:click="runAction" :style="{'background-color' : bgColor, width: width}">
	<div class="_caption" :style="{'color' : labelColor}">${label}</div>
	<div class="_value" :style="{'color' : valueColor}">
		<span class="_prefix" v-if="prefix">${prefix}</span>
		<span class="_integers" :class="{'_longer' : display != null && display.length > 12}">${value}</span>
	</div>
</div>