<div v-bind="$attrs" class="app-field-parent">
	<div v-if="readonly === 'true' || readonly === true" class="md-form-group app-field-input-container app-field-categories-container app-field-categoriescategories-readonly" :field-name="name" :alt-fields="altFields">
		<input v-if="!(isSingle || isLineage)" class="md-input" style="display: none">
		<input v-if="isSingle || isLineage" readonly="true" type="text" class="md-input" :value="caption">
		<div v-else class="app-field-custom-container">
			<div class="app-field-custom-chips">
				<span v-for="branch in branches" class="app-chip"><i class="fas fa-times" v-on:click.stop="remove(branch)"></i>${branch.root.name} : ${branch.name}</span>
			</div>
		</div>
		<label>${label}</label>
	</div>
	<div v-else class="md-form-group app-field-input-container app-field-categories-container" :field-name="name" :alt-fields="altFields">
		<i v-if="busy.fetching && !canBrowse" class="pull-right fas app-field-custom-button fa-circle-notch fa-spin"></i>
		<i v-else class="pull-right fas app-field-custom-button" :class="[(isSingle || isLineage) ? 'fa-caret-down' : 'fa-plus']" v-on:click="browse()" ref="browseButton"></i>

		<div v-if="anyValue" class="app-field-custom-container" style="cursor: pointer" v-on:click="browse()">
			<div v-if="isSingle || isLineage" class="app-field-custom-single pointer no-wrap text-ellipsis" v-on:click="browse()" :title="caption">
				${caption}
			</div>
			<div v-else-if="isMinimal" class="app-field-custom-chips">
				<span v-for="branch in branches" class="app-chip"><i class="fas fa-times" v-on:click.stop="remove(branch)"></i>${branch.name}</span>
			</div>
			<div v-else class="app-field-custom-chips">
				<span v-for="branch in branches" class="app-chip"><i class="fas fa-times" v-on:click.stop="remove(branch)"></i>${branch.root.name} : ${branch.name}</span>
			</div>
		</div>

		<div v-else class="app-field-custom-container">
			<div class="app-field-custom-single pointer" v-on:click="browse()">
				- Seleccione -
			</div>
		</div>
		<input class="md-input" style="display: none">
		<div class="app-field-custom-browser" :class="{'app-field-custom-browser-up' : direction === 'up'}" v-show="canBrowse" ref="box" v-if="current != null">
			<div class="app-field-custom-top-label">
				<i v-if="current.prev != null" style="float: left; font-size: 14px; margin-left: 3px; padding: 4px; cursor: pointer" class="fa fa-chevron-left" v-on:click="prevPage()"></i>
				<span style="font-size: 15px; position: relative; top: 1px">${pageCaption}</span>
				<i v-if="current.next != null" style="float: right; font-size: 14px; margin-right: 3px; padding:4px; cursor: pointer" class="fa fa-chevron-right" v-on:click="nextPage()"></i>
			</div>
			<div class="list white" style="overflow-y: auto; max-height: 230px; padding-top: 5px; padding-bottom: 5px">
				<div v-on:click="select(reference)" v-for="reference in current.references">
					<div class="no-border list-item b-l b-l-2x app-tenant-list-item app-field-reference-list-item" :class="{'app-field-reference-list-selected' : isSelected(reference.id)}">
						<div class="list-body">
							<div class="pull-left text-xs" style="font-size: 14px; margin-right: 5px; padding-top: 1px">
								<i v-if="busy.fetching && isSelected(reference.id)" class="fas fa-circle-notch fa-spin app-field-custom-unselected-icon ng-hide m-l-sm" style="color:#199519"></i>
								<i v-else-if="isSelected(reference.id)" class="far fa-check-circle app-field-custom-unselected-icon ng-hide m-l-sm" style="color:#199519"></i>
								<i v-else class="far fa-circle app-field-custom-unselected-icon ng-hide m-l-sm"></i>
							</div>
							<div class="pull-right text-xs" style="margin-top: 2px; padding-right: 5px">
								<i class="fa fa-chevron-right ng-hide m-l-sm"></i>
							</div>
							<div class="app-field-custom-branch" style="padding-top:1px">
								<a class="_500 ng-binding">${reference.name}</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="app-field-custom-none">
				<a class="app-label-link" v-on:click="clear()">Limpiar</a>
				&nbsp;&nbsp;&nbsp;
				<a class="app-label-link" v-on:click="refresh()">Refrescar</a>
			</div>
		</div>
		<label>${label}</label>
	</div>
</div>