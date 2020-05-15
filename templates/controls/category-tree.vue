<div v-bind="$attrs" class="">
	<div v-if="root" class="app-category-tree-node-container" v-on:click.stop>
		<div v-for="(child, index) in root.childs">
			<div>
				<div class="app-category-tree-node">
					<div v-if="level != null" class="app-category-tree-parent-shape">
						<div :class="{ 'app-category-tree-parent-shape-first' : index === 0}"></div>
					</div>
					<span v-if="child.childs > 0" v-on:click.stop="drilldown(child)">
						<i class="fas" :class="[node != null && node.id === child.id ? 'fa-minus-circle' : 'fa-plus-circle']"></i>
						${child.name}
					</span>
					<span v-else v-on:mouseover="preselected = child" v-on:mouseleave="preselected = null" v-on:click.stop="select(child)">
						<i class="far" :class="(preselected === child || (branch != null && branch.value != null && child != null && branch.value.id === child.id)) ? 'fa-dot-circle' : 'fa-circle'"></i>
						${child.name}
					</span>
				</div>
				<div class="app-category-tree-subnode" v-if="node != null && node.id === child.id">
					<table cellpadding="0" cellspacing="0">
						<tr>
							<td v-if="level != null && level >= 0" class="app-category-subnode-vertical"></td>
							<td v-if="level == null" class="app-category-subnode-blank"></td>
							<td :class="{'app-category-tree-subnode-content' : level != null && level >= 0}" ref="test">
								<category-tree :level="level != null ? level + 1 : 0" :reference="node" :branch="branch" v-on:select="onSelected"></category-tree>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>