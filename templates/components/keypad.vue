<div class="app-terminal-total-title" :style="{opacity : disabled === true ? 0.8 : 1}">
	<div class="app-terminal-lookup-keypad-container">
		<table cellspacing="0" cellpadding="0" v-if="layout === 'cost'">
			<tr>
				<td colspan="3">
					<console-key icon="fa-undo" :action="reset" bg-color="#898989" color="white"></console-key>
				</td>
			</tr>
			<tr>
				<td>
					<console-key label="7" :action="pushKey" value="7"></console-key>
				</td>
				<td>
					<console-key label="8" :action="pushKey" value="8"></console-key>
				</td>
				<td>
					<console-key label="9" :action="pushKey" value="9"></console-key>
				</td>
			</tr>
			<tr>
				<td>
					<console-key label="4" :action="pushKey" value="4"></console-key>
				</td>
				<td>
					<console-key label="5" :action="pushKey" value="5"></console-key>
				</td>
				<td>
					<console-key label="6" :action="pushKey" value="6"></console-key>
				</td>
			</tr>
			<tr>
				<td>
					<console-key label="1" :action="pushKey" value="1"></console-key>
				</td>
				<td>
					<console-key label="2" :action="pushKey" value="2"></console-key>
				</td>
				<td>
					<console-key label="3" :action="pushKey" value="3"></console-key>
				</td>
			</tr>
			<tr>
				<td>
					<console-key label="0" :action="pushKey" value="0"></console-key>
				</td>
				<td>
					<console-key label="." :disabled="dot === false || dot === 'false'" :action="pushKey" value="."></console-key>
				</td>
				<td>
					<console-key icon="fa-long-arrow-alt-left" bg-color="#898989" :action="backspace"></console-key>
				</td>
			</tr>
		</table>


		<table cellspacing="0" cellpadding="0" v-if="layout == null || layout === '' || layout === 'cash'">
			<tr>
				<td>
					<console-key prefix-icon="fa-plus" label="1" :action="sumKey" value="1" bg-color="#c59051" align="right"></console-key>
				</td>
				<td>
					<console-key prefix-icon="fa-plus" label="100" :action="sumKey" value="100" bg-color="#FF7F50" align="right"></console-key>
				</td>
				<td colspan="3">
					<console-key icon="fa-undo" :action="reset" bg-color="#898989" color="white"></console-key>
				</td>
			</tr>
			<tr>
				<td>
					<console-key prefix-icon="fa-plus" label="5" :action="sumKey" value="5" bg-color="#a98d95" align="right"></console-key>
				</td>
				<td>
					<console-key prefix-icon="fa-plus" label="200" :action="sumKey" value="200" bg-color="#DB7093" align="right"></console-key>
				</td>
				<td>
					<console-key label="7" :action="pushKey" value="7"></console-key>
				</td>
				<td>
					<console-key label="8" :action="pushKey" value="8"></console-key>
				</td>
				<td>
					<console-key label="9" :action="pushKey" value="9"></console-key>
				</td>
			</tr>
			<tr>
				<td>
					<console-key prefix-icon="fa-plus" label="10" :action="sumKey" value="10" bg-color="#948161" align="right"></console-key>
				</td>
				<td>
					<console-key prefix-icon="fa-plus" label="500" :action="sumKey" value="500" bg-color="#66CDAA" align="right"></console-key>
				</td>
				<td>
					<console-key label="4" :action="pushKey" value="4"></console-key>
				</td>
				<td>
					<console-key label="5" :action="pushKey" value="5"></console-key>
				</td>
				<td>
					<console-key label="6" :action="pushKey" value="6"></console-key>
				</td>
			</tr>
			<tr>
				<td>
					<console-key prefix-icon="fa-plus" label="25" :action="sumKey" value="25" bg-color="#777777" align="right"></console-key>
				</td>
				<td>
					<console-key prefix-icon="fa-plus" label="1000" :action="sumKey" value="1000" bg-color="#FF0000" align="right"></console-key>
				</td>
				<td>
					<console-key label="1" :action="pushKey" value="1"></console-key>
				</td>
				<td>
					<console-key label="2" :action="pushKey" value="2"></console-key>
				</td>
				<td>
					<console-key label="3" :action="pushKey" value="3"></console-key>
				</td>
			</tr>
			<tr>
				<td>
					<console-key prefix-icon="fa-plus" label="50" :action="sumKey" value="50" bg-color="#9370DB" align="right"></console-key>
				</td>
				<td>
					<console-key prefix-icon="fa-plus" label="2000" :action="sumKey" value="2000" bg-color="#6A5ACD" align="right"></console-key>
				</td>
				<td>
					<console-key label="0" :action="pushKey" value="0"></console-key>
				</td>
				<td>
					<console-key label="." :disabled="dot === false || dot === 'false'" :action="pushKey" value="."></console-key>
				</td>
				<td>
					<console-key icon="fa-long-arrow-alt-left" bg-color="#898989" :action="backspace"></console-key>
				</td>
			</tr>
		</table>

		<table cellspacing="0" cellpadding="0" v-if="layout === 'full'" style="font-size: 0.7em">
			<tr>
				<td>
					<console-key label="1" :action="pushKey" value="1"></console-key>
				</td>
				<td>
					<console-key label="2" :action="pushKey" value="2"></console-key>
				</td>
				<td>
					<console-key label="3" :action="pushKey" value="3"></console-key>
				</td>
				<td>
					<console-key label="4" :action="pushKey" value="4"></console-key>
				</td>
				<td>
					<console-key label="5" :action="pushKey" value="5"></console-key>
				</td>
				<td>
					<console-key label="6" :action="pushKey" value="6"></console-key>
				</td>
				<td>
					<console-key label="7" :action="pushKey" value="7"></console-key>
				</td>
				<td>
					<console-key label="8" :action="pushKey" value="8"></console-key>
				</td>
				<td>
					<console-key label="9" :action="pushKey" value="9"></console-key>
				</td>
				<td>
					<console-key label="0" :action="pushKey" value="0"></console-key>
				</td>
			</tr>
			<tr>
				<td>
					<console-key label="Q" :action="pushKey" value="Q"></console-key>
				</td>
				<td>
					<console-key label="W" :action="pushKey" value="W"></console-key>
				</td>
				<td>
					<console-key label="E" :action="pushKey" value="E"></console-key>
				</td>
				<td>
					<console-key label="R" :action="pushKey" value="R"></console-key>
				</td>
				<td>
					<console-key label="T" :action="pushKey" value="T"></console-key>
				</td>
				<td>
					<console-key label="Y" :action="pushKey" value="Y"></console-key>
				</td>
				<td>
					<console-key label="U" :action="pushKey" value="U"></console-key>
				</td>
				<td>
					<console-key label="I" :action="pushKey" value="I"></console-key>
				</td>
				<td>
					<console-key label="O" :action="pushKey" value="O"></console-key>
				</td>
				<td>
					<console-key label="P" :action="pushKey" value="P"></console-key>
				</td>
			</tr>
			<tr>
				<td>
					<console-key label="A" :action="pushKey" value="A"></console-key>
				</td>
				<td>
					<console-key label="S" :action="pushKey" value="S"></console-key>
				</td>
				<td>
					<console-key label="D" :action="pushKey" value="D"></console-key>
				</td>
				<td>
					<console-key label="F" :action="pushKey" value="F"></console-key>
				</td>
				<td>
					<console-key label="G" :action="pushKey" value="G"></console-key>
				</td>
				<td>
					<console-key label="H" :action="pushKey" value="H"></console-key>
				</td>
				<td>
					<console-key label="J" :action="pushKey" value="J"></console-key>
				</td>
				<td>
					<console-key label="K" :action="pushKey" value="K"></console-key>
				</td>
				<td>
					<console-key label="L" :action="pushKey" value="L"></console-key>
				</td>
				<td>
					<console-key label="-" :action="pushKey" value="-"></console-key>
				</td>
			</tr>
			<tr>
				<td>
					<console-key label="Z" :action="pushKey" value="Z"></console-key>
				</td>
				<td>
					<console-key label="X" :action="pushKey" value="X"></console-key>
				</td>
				<td>
					<console-key label="C" :action="pushKey" value="C"></console-key>
				</td>
				<td>
					<console-key label="V" :action="pushKey" value="V"></console-key>
				</td>
				<td>
					<console-key label="B" :action="pushKey" value="B"></console-key>
				</td>
				<td>
					<console-key label="N" :action="pushKey" value="N"></console-key>
				</td>
				<td>
					<console-key label="M" :action="pushKey" value="M"></console-key>
				</td>
				<td>
					<console-key label="." :disabled="dot === false || dot === 'false'" :action="pushKey" value="."></console-key>
				</td>
				<td>
					<console-key label="/" :action="pushKey" value="/"></console-key>
				</td>
				<td>
					<console-key icon="fa-long-arrow-alt-left" :action="backspace" bg-color="#898989"></console-key>
				</td>
			</tr>
			<tr>
				<td colspan="8">
					<console-key :action="pushKey" value=" "></console-key>
				</td>
				<td colspan="2">
					<console-key icon="fa-undo" :action="reset" bg-color="#898989" color="white"></console-key>
				</td>
			</tr>
		</table>
	</div>
</div>