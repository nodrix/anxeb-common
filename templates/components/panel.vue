<div class="app-panel-container"
     v-if="(hideAt == null || screen.width == null || screen.width >= parseInt(hideAt)) && (showAt == null || screen.width == null || screen.width < parseInt(showAt))"
     :style="{'max-width':maxWidth + '!important','min-width':minWidth + '!important', width: finalWidth, 'padding-left': offset === 'left' || offset === 'both' ? '50px' : null, 'padding-right': offset === 'right' || offset === 'both' ? '50px' : null }"
     :class="{'app-panel-over-left' : over === 'true' && isLeft, 'app-panel-over-right' : over === 'true' && isRight, 'app-panel-container-body': isBody,
     'app-panel-container-left': isLeft, 'app-panel-container-right': isRight, 'pull-right' : isRight,
     'col-lg': isLeft || isRight, 'dimmed' : isLeft || isRight,  'lt' : isLeft || isRight,  'bg-auto':isLeft || isRight}" v-bind="$attrs">

	<div class="app-panel-container-table" :class="{'app-panel-shadow' : over === 'true' && visible === true}">
		<div v-if="visible && title" class="app-panel-content-header">
			<div class="pos-rlt app-panel-header app-session">
				<div class="_title-container">
					<span class="text-left" v-if="caption && caption.length > 0">
						<span style="line-height: 0; position: relative; top:4px">${title}</span><br>
						<span class="text-muted" style="font-weight: normal; font-size: 0.8em; line-height: 0; position: relative;top:-3px">${caption}</span>
					</span>
					<span class="text-left" v-else>
						<span style="line-height: 0; position: relative; top:11px">${title}</span>
						<br>
						&nbsp;
					</span>
					<div class="pull-right" style="position: relative; top:-10px">
						<i v-if="allowCollapse !== false" class="fas" :class="[collapseIcon || 'fa-times']" v-on:click="actions.hide"></i>
						<div v-if="isButtons && allowCollapse !== false" class="app-session-space"></div>
						<slot v-if="isButtons" name="buttons" v-bind:actions="actions"></slot>
					</div>
				</div>
			</div>
		</div>

		<div class="app-panel-content-body">
			<div v-if="!visible && isRight" class="pos-rlt" style="height: 100%; padding-top: 10px" v-on:click.stop="visible = true">
				<span class="nav-label" v-if="label != null" style="position: absolute">
                    <span style="position: relative; top:-1px; left: 12px"><b class="label rounded label-sm blue-500">${label}</b></span>
                </span>
				<div class="app-session app-session-icon">
					<i style="font-size: 16px!important;" class="fas" :class="[icon || 'fa-chevron-left']"></i>
				</div>
			</div>

			<div v-if="!visible && isLeft" class="pos-rlt" style="height: 100%;  padding-top: 10px" v-on:click.stop="visible = true">
				<span class="nav-label" v-if="label != null" style="position: absolute">
                    <span style="position: relative; top:-1px; left: 12px"><b class="label rounded label-sm blue-500">${label}</b></span>
                </span>
				<div class="app-session app-session-icon">
					<i style="font-size: 16px!important;" class="fas" :class="[icon || 'fa-chevron-right']"></i>
				</div>
			</div>

			<div v-if="visible" ref="body" v-on:scroll="updateScroll" class="_content app-scrollable pos-rlt" :class="{'p-a': (noPadding !== 'true' &&  noPadding !== true)}" v-bind:style="{'border-left': border ? border.left : '', 'border-right': border ? border.right : '', 'background-color':color, 'padding-top' : title != null ? '0px!important' : null}" style="padding-bottom: 0px!important">
				<slot name="content" v-bind:actions="actions"></slot>
			</div>

			<transition name="fade">
			<div class="_more-icon" v-if="visible && scrollValue != null && scrollValue > 5" :style="{width: finalWidth,'max-width':maxWidth + '!important'}">
				<i v-on:click="scrollDown" class="fa fa-chevron-circle-down"></i>
			</div>
			</transition>
		</div>
		<div class="app-panel-content-foot" v-if="visible && isFooter">
			<div class="pos-rlt app-panel-footer">
				<div class="p-a app-panel-footer-shadow">
					<slot name="footer"></slot>
				</div>
			</div>
		</div>
	</div>
</div>