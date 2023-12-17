<template>
    <div class="diia-warning-alert" style="background-color: #FFF7E3; padding: 16px;"><table><tr>
        <td style="font-size: 38px; padding: 0px 17px 0px 0px; margin: 0px;" align="start">☝️</td>
        <td style="font-size: 16px; line-height: 24px;">
            {{ text }}
        </td>
    </tr></table></div>
</template>

<script>
export default {
  name: "DiiaMessageBox",
  props: ['text',],
}
</script>