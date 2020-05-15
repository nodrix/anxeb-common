<div class="row-col" xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<panel width="34vw" v-if="references" title="Lista de Elementos" :caption="'Contiene ' + (references && references.length > 0 ? references.length : '') + (parent != null ? ' sub elementos' : ' rubros principales')">
		<template v-slot:content="{actions}">
			<div class="app-session-container">
				<div class="list white no-radius">
					<div v-on:click="select(reference)" class="app-tenant-list-item b-l b-l-4x " v-for="reference in references" :class="{'app-tenant-list-item-selected' : selected != null && selected.id === reference.id}">
						<div class="list-item no-border ng-scope">
							<div class="list-left app-list-item-icon">
								<div class="fa fa-folder"></div>
							</div>
							<div class="list-body">
								<div class="pull-right text-xs">
									<i v-if="$root.can(reference).be.edited" class="fa fa-edit ng-hide m-l-sm" v-on:click="edit(reference)"></i>
									<i v-if="$root.can(reference).be.deleted" class="fa fa-trash ng-hide m-l-sm" v-on:click.stop="remove(reference)"></i>
									<i class="fa fa-chevron-right ng-hide m-l-sm" v-on:click.stop="stepdown(reference)" v-if="!route.child.last"></i>
								</div>
								<div>
									<a class="_500 ng-binding">${reference.name}</a>
								</div>
								<div v-if="route.parent == null && route.child.last" class="text-ellipsis text-muted text-sm ng-binding">
									<a v-on:click.stop="edit(reference)" class="app-label-link">Editar</a>
								</div>
								<div v-else class="text-ellipsis text-muted text-sm ng-binding">
									<a v-if="!route.child.last" v-on:click.stop="stepdown(reference)" class="app-label-link"><b v-if="reference.childs > 0">${reference.childs}</b><span v-else>Sin</span> ${reference.childs === 1 ? route.child.caption : route.child.plural | lower}</a>
									<a v-else v-on:click.stop="stepup()" class="app-label-link">Volver a ${route.parent.plural | lower}</a>
								</div>
							</div>
						</div>
					</div>

					<div v-on:click="add()" class="list-item b-l b-l-2x ng-scope app-tenant-list-item">
						<div class="list-left app-list-item-icon">
							<div class="fa fa-plus"></div>
						</div>
						<div class="list-body">
							<a class="_500 ng-binding">Agregar ${route.caption}</a>
							<div class="text-ellipsis text-muted text-sm ng-binding widget-subtitle">
								Crear nuevo elemento
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>
	</panel>
	<panel type="body">
		<template v-slot:content="{}">
			<div v-if="selected == null" class="app-grid-empty-container">
				<div class="icon">
					<span class="fas fa-chevron-left"></span>
				</div>
				<div class="message">
					<div class="text">Seleccione un elemento para editar</div>
					<a v-on:click="add()">Crear ${route.he ? 'nuevo ' : 'nueva ' + route.caption | lower}</a>
				</div>
			</div>

			<div class="pos-rlt" v-else>
				<div class="b-b b-primary nav-active-primary hidden-md-down app-tabs-container">
					<ul class="nav nav-tabs">
						<li class="nav-item" v-if="!route.child.last">
							<a :class="{ active : $router.currentRoute.path.endsWith('/items') }" v-on:click="$root.navigate('items', parent ? { parent : parent.id } : undefined)" class="nav-link">${route.child ? route.child.plural :'Sub Elementos'}</a>
						</li>
						<li class="nav-item" v-if="$root.can(selected).be.edited">
							<a :class="{ active : $router.currentRoute.path.endsWith('/detail') }" v-on:click="$root.navigate('detail', parent ? { parent : parent.id } : undefined)" class="nav-link">Detalle</a>
						</li>
					</ul>
				</div>
				<div class="tab-content m-b-md app-tab-content">
					<router-view></router-view>
				</div>
			</div>
		</template>
	</panel>
</div>
