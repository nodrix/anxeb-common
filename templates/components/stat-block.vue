<div>
<table>
  <tr>
    <td>
    <span class="w-48 rounded" style="color: white" :style="{'background-color' : color ?? 'var(--app-background-color)'}">
      <i class="fa" :class="icon ?? 'fa-chevron-right'" style="font-size: 24px; position: relative; top:3px"></i>
    </span>
    </td>
    <td style="padding-left: 8px; padding-bottom: 2px">
      <span style="font-size: 11px; text-transform: uppercase; font-weight: 600; color: #555555; line-height: 0">${label}</span><br>
      <span v-if="text != null && text.length > 0" style="font-size: 18px; font-weight: 300; line-height: 0; color: var(--app-background-darker)">${text}</span>
      <span v-else style="font-size: 18px; font-weight: 300; line-height: 0; color: var(--app-background-darker)" class="text-danger">Sin registro</span>
    </td>
  </tr>
</table>
</div>