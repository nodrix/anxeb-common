<div style="height: 100%">
	<object :data="openUrl" type="application/pdf" width="100%" height="100%">
		Este navegador no tiene soporte para visualizar archivos PDF. Favor
		<a class="app-link" :href="downloadUrl" target="_blank">descargar</a> el reporte para verlo.
	</object>

	<iframe ref="downloadIframe" style="display:none;"></iframe>
</div>
