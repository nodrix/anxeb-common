<form>
	<div class="box">
		<div class="box-body">
			<div class="row">
				<field-input class="col-sm-12" v-model="model.name" label="Nombre"></field-input>
			</div>
			<div class="row" v-if="model.meta" v-for="field in model.meta">
				<field-select class="col-sm-12" v-if="field.options != null" v-model="field.value" :items="field.options" :label="field.label" show-first="true"></field-select>
				<field-input class="col-sm-12" v-else v-model="field.value" :type="field.type" :label="field.label"></field-input>
			</div>
		</div>
	</div>
</form>