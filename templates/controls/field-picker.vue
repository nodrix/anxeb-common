<div v-bind="$attrs" class="app-field-parent">
	<div v-if="readonly === 'true' || readonly === true" class="md-form-group app-field-input-container app-field-categories-container app-field-categories-readonly" :field-name="name" :alt-fields="altFields">
		<input class="md-input" style="display: none">
		<div class="app-field-custom-container">
			<div class="app-field-custom-chips">
				<span v-for="(option, value) in options" v-if="isSelected(value)" class="app-chip">${option}</span>
			</div>
		</div>
		<label>${label}</label>
	</div>
	<div v-else class="md-form-group app-field-input-container app-field-categories-container" :field-name="name" :alt-fields="altFields">
		<i v-if="notReadOnly" class="pull-right fas app-field-custom-button fa-plus" v-on:click.stop="browse()" ref="btn"></i>

		<div v-if="anyValue" class="app-field-custom-container" style="cursor: pointer" v-on:click.stop="browse()" ref="btnBox">
			<div class="app-field-custom-chips">
				<span v-for="(option, value) in options" v-if="isSelected(value)" class="app-chip">${option}<i class="fas fa-times" v-on:click.stop="remove(value)"></i></span>
			</div>
		</div>
		<div v-else class="app-field-custom-container" style="cursor: pointer" v-on:click.stop="browse()" ref="btnBox">
			<div class="app-field-custom-single pointer no-wrap text-ellipsis">
				- Agregue -
			</div>
		</div>

		<input class="md-input" style="display: none">
		<div class="app-field-custom-browser" :class="{'app-field-custom-browser-up' : direction === 'up'}" v-show="canBrowse" ref="box">
			<div class="app-field-custom-top-label">
				<span style="font-size: 15px; position: relative; top: 1px">Opciones</span>
			</div>
			<div class="white" style="overflow-x: auto; max-height: 230px; padding-top: 4px">
				<div v-for="(option, value) in options" style="display: inline-block">
					<div v-on:click.stop="isSelected(value) ? remove(value) : select(value)">
						<div class="no-border app-tenant-list-item app-field-picker-list-item" :class="{'app-field-picker-list-selected' : isSelected(value)}">
							<div class="list-body">
								<div class="pull-left text-xs" style="font-size: 14px; margin-right: 5px; padding-top: 1px">
									<i v-if="isSelected(value)" class="far fa-check-circle app-field-custom-unselected-icon" style="color:#199519"></i>
									<i v-else class="far fa-circle app-field-custom-unselected-icon"></i>
								</div>
								<div class="app-field-custom-branch" style="padding-top:1px; display: inline-block">
									<a class="_500 ng-binding">${option}</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="app-field-custom-none">
				<a class="app-label-link" v-on:click="clear()">Limpiar</a>
			</div>
		</div>
		<label>${label}</label>
	</div>
</div>