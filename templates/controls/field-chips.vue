<div v-bind="$attrs" class="app-field-parent">
	<div v-if="readonly === 'true' || readonly === true" class="md-form-group app-field-input-container app-field-categories-container app-field-categories-readonly" :field-name="name" :alt-fields="altFields">
		<input class="md-input" style="display: none">
		<div class="app-field-custom-container">
			<div class="app-field-custom-chips">
				<span v-for="chip in chips" class="app-chip">${chip.name}</span>
			</div>
		</div>
		<label>${label}</label>
	</div>
	<div v-else class="md-form-group app-field-input-container app-field-categories-container" :field-name="name" :alt-fields="altFields">
		<input placeholder="Nombre de Grupo" v-show="canBrowse" class="md-input app-field-lookup-input" v-model="newChips" type="text" ref="txtChip" v-on:keyup.esc.prevent="cancel" v-on:keyup.enter.prevent="enter">
		<i v-if="!canBrowse && notReadOnly" class="pull-right fas app-field-custom-button fa-plus" v-on:click="browse()" ref="browseButton"></i>

		<div v-if="!canBrowse && anyValue" class="app-field-custom-container">
			<div class="app-field-custom-chips">
				<span v-for="(chip, index) in chips" class="app-chip">${chip.name}<i class="fas fa-times" v-on:click="remove(chip, index)"></i></span>
			</div>
		</div>
		<div v-if="!canBrowse && !anyValue" class="app-field-custom-container">
			<div class="app-field-custom-single pointer" v-on:click="browse()">
				- Agregue -
			</div>
		</div>
		<label>${label}</label>
	</div>
</div>