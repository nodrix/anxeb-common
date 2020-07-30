<div class="app-field-parent" v-bind="$attrs">
	<div ref="cbutton" v-show="loaded === true">
			<div class="app-field-map-button" title="Resetear" v-on:click.stop="gotoMarker()">
			<i class="fa fa-crosshairs"></i>
		</div>
		<div class="app-field-map-button" title="Centrar Marca" v-on:click.stop="bringMarker()">
			<i class="fa fa-map-marked-alt"></i>
		</div>
	</div>

	<div class="md-form-group app-field-input-container" :field-name="name">
		<div class="app-field-image-container">
			<div ref="container" v-bind:style="{height:height, width:width}"></div>
		</div>
		<input class="md-input" style="display: none">
		<label>${label}</label>
	</div>
</div>