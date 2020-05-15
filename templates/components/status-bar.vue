<div>
	<div class="text-xs" :class="{'p-2': type !== 'terminal', 'app-terminal-status-bar': type === 'terminal'}">
		<div class="pull-right" :class="{'text-muted': type !== 'terminal'}">
			&copy; Copyright <strong>${appName}</strong> powered By <strong>Nodrix SRL</strong>
			<span class="hidden-xs-down">- Build v${appVersion}</span>
		</div>
		<div class="nav" v-html="finalHint">
		</div>
	</div>
</div>