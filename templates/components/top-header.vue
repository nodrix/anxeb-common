<div class="app-fluid-title">
	<div v-if="type === 'terminal'" class="app-terminal-header-container">
		<div class="app-terminal-app-logo">
			<img src="images/logos/logo-white.png">
		</div>
		<div class="app-terminal-header-titles-container">
			<div class="app-terminal-header-titles-leftline">
				<div class="app-terminal-header-title"><span class="text-ellipsis">${fullTitle}</span></div>
				<div class="app-terminal-header-subtitle"><span class="text-ellipsis">${subtitle}</span></div>
			</div>
		</div>
		<top-stats></top-stats>
		<div class="app-terminal-stats-actions">
			<div>
				<i v-if="actions.logout" v-on:click="actions.logout" class="fa fa-power-off"></i>
				<i v-if="actions.shift" v-on:click="actions.shift" class="fa fa-user-clock"></i>
				<i v-if="actions.settings" class="fa fa-cog" v-on:click="actions.settings"></i>
				<i v-if="actions.refresh" class="fa fa-sync" v-on:click="actions.refresh"></i>
				<i v-if="!fullscreen" class="fa fa-expand-arrows-alt" v-on:click="toggleFullScreen()"></i>
				<i v-else class="fa fa-compress-arrows-alt" v-on:click="toggleFullScreen()"></i>
			</div>
		</div>
	</div>
	<div v-else class="app-page-title app-page-title-large">
		<table cellpadding="0" cellspacing="0" style="position: relative" :style="{'top' : subtitle != null && subtitle !== '' ? '-1px' : '4px'}">
			<tr>
				<td>
					<span class="fa fas" :class="action ? (icon + ' app-top-action-icon') : icon" v-on:click="actionCall()"></span>
				</td>
				<td>
					<div style="position: relative" :style="{'top' : subtitle != null && subtitle !== '' ? '-1px' : '0px'}">
						<span class="app-page-title-text" v-html="fullTitle"></span>
						<br v-if="subtitle != null && subtitle !== ''">
						<span class="app-page-subtitle-text" v-if="subtitle != null && subtitle !== ''" v-html="subtitle"></span>
					</div>
				</td>
			</tr>
		</table>
	</div>
</div>