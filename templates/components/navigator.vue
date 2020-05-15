<div class="app-scrollable" data-flex>
	<nav class="scroll nav-light app-navigator">
		<ul class="nav" ui-nav v-for="section in sections" v-show="section.available()">
			<li class="nav-header hidden-folded app-nav-session" v-if="section.caption && section.visible !== false">
				<small v-bind:style="{color:section.caption.color || colors.foreground}" v-html="section.caption.title"></small>
			</li>

			<ul ui-nav v-for="group in section.groups" v-if="section.groups && section.groups.length">
				<li v-bind:class="{'active': group.active === true }" v-show="group.available()" v-on:click="group.action ? group.action() : undefined" v-on:mouseover="$parent.page.setHint(group)">
					<router-link :to="group.path || ''" :event="group.path ? undefined : ''" v-bind:class="{'app-group-active': group.active === true }" class="app-group-label">
		                <span class="nav-caret" v-if="group.pages && group.pages.length">
		                    <i class="fa fa-caret-down"></i>
		                </span>
						<span class="nav-label" v-if="group.label">
                            <b class="label rounded label-sm" v-bind:style="{backgroundColor:group.label.fill || colors.darker, color:group.label.color || colors.foreground}">${group.label.text}</b>
                        </span>
						<span class="nav-icon">
                            <span class="fa fas" :class="group.icon.class" v-bind:style="{color:group.icon.color || colors.foreground}"></span>
		                </span>
						<span class="nav-text" v-bind:style="{color : group.caption.color}" v-html="group.caption.title"></span>
					</router-link>

					<ul class="nav-sub" v-if="group.pages && group.pages.length">
						<li v-for="page in group.pages" v-bind:class="{'app-group-page-active' : page.active === true}" v-show="(!page.role || page.role.includes($root.profile.role)) && (!page.owners || page.owners.includes($root.profile.type))" v-on:mouseover="$parent.page.setHint(page)" v-on:click="page.action ? page.action() : undefined">
                            <span class="nav-label" v-if="page.label && page.label.visible !== false" style="position: relative; top:5px; left:-13px">
                                <b class="label rounded label-sm" v-bind:style="{backgroundColor:page.label.fill, color:page.label.color || colors.foreground}">${page.label.text}</b>
                            </span>
							<router-link :to="page.path || ''" :event="page.path ? undefined : ''">
								<span class="nav-text" v-bind:style="{color:page.caption.color || colors.foreground}" v-html="page.caption.title"></span>
							</router-link>
						</li>
					</ul>
				</li>
			</ul>
		</ul>
	</nav>
</div>