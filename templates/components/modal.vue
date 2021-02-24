<div ref="modalElement" class="modal app-modal-backdrop" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
	<div :style="{'min-width' : width, 'border-radius' : radius != null ? radius : null}" class="modal-dialog" :class="{'modal-lg' : size === 'large', 'modal-sm' : size === 'small', 'modal-md' : size === 'medium', 'modal-fl' : size === 'full'}">
		<div v-show="loaded === true" class="modal-content" :style="{'border-radius' : radius != null ? radius : null}">
			<div class="modal-header" v-if="header !== false">
				<h5 class="modal-title">
					<i v-if="icon" class="fas fa app-modal-icon" :class="icon"></i>
					<span v-html="title"></span>
				</h5>
				<button v-if="onCancel" type="button" class="close" aria-label="Close" data-dismiss="modal" v-on:click="cancel">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>

			<div class="modal-body app-modal-body" :style="{opacity: isBusy ? 0.5 : null}">
				<span v-if="message != null && message.length > 0" v-html="message"></span>
				<div v-if="prompt" :class="{'app-modal-prompt': message != null && message.length > 0}">
					<form v-on:submit.prevent>
						<div v-if="prompt.type === 'calendar'" style="text-align: center; padding-top: 10px; padding-bottom: 10px">
							<v-date-picker v-model="date" locale="es" :title-date-format="formatDate" style="height:390px"></v-date-picker>
						</div>
						<div v-if="prompt.type === 'calendar-time'" style="text-align: center; padding-top: 10px; padding-bottom: 10px">
							<div class="row-col">
								<div class="col-sm-6">
									<v-date-picker v-model="date" locale="es" :title-date-format="formatDate" style="height:390px"></v-date-picker>
								</div>
								<div class="col-sm-6">
									<v-time-picker v-model="time" style="height:390px">
									</v-time-picker>
								</div>
							</div>
						</div>
						<field-input v-else v-model="value" :label="promptLabel" :type="prompt.type || (prompt.rows === 1 ? 'text' : 'area')" :rows="prompt.rows || 5" ref="promptElement" v-on:keyup.enter="enter"></field-input>
					</form>
				</div>

				<component ref="component" v-if="component" v-bind:is="component.name" :key="key"></component>

				<notifications :floating="float" class="app-form-notification" ref="notifications"></notifications>
			</div>

			<div v-if="buttonsLength > 0" :class="{'modal-footer' : centered !== true, 'app-modal-buttons-centered' : centered === true, 'app-modal-buttons-bordeless' : header === false}">
				<button :style="{width: button.width}" v-for="button in buttons" :disabled="isBusy || (button.prompted ? (prompt.required !== false && (value == null || value.length === 0 || value === '')) : (button.disabled != null ? button.disabled : false))" class="btn btn" :class="button.class || 'primary'" type="button" @click="button.action()" v-if="button.visible !== false">
					<i v-if="button.icon && !button.busy" class="fa" :class="button.icon"></i>
					<i v-if="button.icon && button.busy" class="fa fa-circle-notch fa-spin"></i>
					${button.text}
				</button>
			</div>
		</div>
		<div class="modal-content fade-out" v-show="loaded !== true">
			<div class="modal-body app-modal-loading">
				<i class="fas fa-spinner fa-spin"></i><br>
				<span>Cargando</span>
			</div>
		</div>
		<div class="app-center-loading" v-show="isBusy">
			<i class="fas fa-spinner fa-spin"></i>
		</div>
	</div>
</div>