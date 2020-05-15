<div class="app-grid" v-if="rows">
	<div v-if="filtered === false && count === 0 && emptyOptions != null" class="app-grid-empty-container" :style="{'margin-top' : emptyOffset}">
		<div class="icon">
			<span class="fas" :class="emptyOptions.icon != null ? [emptyOptions.icon] : ['fa-exclamation-circle']"></span>
		</div>
		<div class="message">
			<div :style="{'margin-top' : emptyOptions.caption ? '' : '11px'}" class="text">${emptyOptions.label || 'Tabla sin Registros'}</div>
			<a v-if="emptyOptions.caption" v-on:click="emptyOptions.action">${emptyOptions.caption}</a>
		</div>

	</div>
	<div v-else>
		<div style="height: 68px" v-if="exists('tools') || exists('filters')">
			<form v-on:submit.prevent class="app-grid-tools app-grid-tools-left">
				<slot name="tools" v-bind:options="{sort:sort, refresh:refresh}"></slot>
			</form>
			<form v-on:submit.prevent class="app-grid-tools app-grid-tools-right">
				<slot name="filters" v-bind:options="{sort:sort, refresh:refresh}"></slot>
			</form>
		</div>

		<div class="app-grid-title" v-if="$slots.title !== undefined">
			<slot name="title"></slot>
		</div>

		<div class="_table">
		<table class="app-grid-table" v-if="listType == null || listType === 'table'">
			<slot name="header" v-bind:options="{sort:sort}"></slot>
			<slot v-for="(row, index) in rows" name="rows" v-bind:row="row" :index="(page * paging) + index"></slot>
			<slot name="footer"></slot>
		</table>
		</div>

		<div class="app-grid-widgets-container" v-if="listType === 'widget'">
			<div class="app-grid-widgets-subcontainer">
				<slot name="widgets" v-for="(row, index) in rows" v-bind:options="{sort:sort, refresh:refresh}" v-bind:item="row" :index="(page * paging) + index"></slot>
				<slot name="last" v-bind:options="{sort:sort, refresh:refresh}"></slot>
			</div>
		</div>

		<div class="app-grid-paging" v-if="showPaging == null || showPaging === true">
			<div class="app-grid-paging-box" v-if="count > 0">
				<i class="fas fa-angle-double-left" v-on:click="first()" v-bind:class="{'app-grid-paging-btn-disabled' : page <= 0}"></i>
				<i class="fas fa-angle-left" v-on:click="prev()" v-bind:class="{'app-grid-paging-btn-disabled' : page <= 0}"></i>
				<span>Mostrando <b>${rows ? rows.length : 0}</b> de <b>${count}</b> registros en la página <b>${current}</b> de <b>${pages}</b></span>
				<i class="fas fa-angle-right" v-on:click="next()" v-bind:class="{'app-grid-paging-btn-disabled' : page >= total}"></i>
				<i class="fas fa-angle-double-right" v-on:click="last()" v-bind:class="{'app-grid-paging-btn-disabled' : page >= total}"></i>
			</div>
		</div>

		<div class="app-grid-paging" v-if="rows && rows.length === 0">
			<div class="app-grid-paging-box">
			<span v-if="rows && rows.length > 0">
				Búsqueda sin resultados
			</span>
				<span v-else>
				Tabla sin resultados
			</span>
			</div>
		</div>
	</div>
</div>
