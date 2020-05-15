<div :class="{'app-notification-floating': floating === 'true' || floating === true}">
	<transition-group name="app-notifications-group" tag="div">
		<div v-for="notification in items" :key="notification.key" class="app-alert-box" v-bind:class="{'app-alert-danger' : notification.type === 'exception', 'app-alert-info' : notification.type === 'information', 'app-alert-notification' : notification.type === 'notification'}">
			<span class="app-notification-content">
		        <i class="fas" v-bind:class="{'fa-exclamation-triangle' : notification.type === 'exception', 'fa-info-circle' : notification.type === 'information' || notification.type === 'notification'}"></i>
			    <span v-html="notification.message"></span>
				<div class="_subtitle" v-if="notification.subtitle" v-html="notification.subtitle"></div>
		    </span>
		</div>
	</transition-group>
</div>