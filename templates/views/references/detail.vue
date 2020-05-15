<div>
	<div class="app-page-form" v-if="reference">
		<form>
			<div class="row">
				<field-input class="col-sm-12" v-model="parent.selected.name" label="Nombre"></field-input>
			</div>
			<div class="row" v-if="parent.selected.meta" v-for="field in parent.selected.meta">
				<field-select class="col-sm-6" v-if="field.options != null" v-model="field.value" :items="field.options" :label="field.label" show-first="true"></field-select>
				<field-input class="col-sm-6" v-else v-model="field.value" :type="field.type" :label="field.label"></field-input>
			</div>
		</form>
	</div>

	<div class="app-buttons-right">
		<button v-on:click="parent.save(parent.selected)" class="btn primary" type="button">Guardar</button>
	</div>
</div>