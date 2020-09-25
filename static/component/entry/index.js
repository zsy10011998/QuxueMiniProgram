Component({
  externalClasses: ['entry-class'],

  properties:
  {
    // 功能icon的图片链接
    picSrc: {
      type: String,
      value: "default"
    },

    // 功能名称，例如 "聊天机器人"
    entryName: {
      type: String,
      value: "default"
    },

    // 功能介绍
    entryText: {
      type: String,
      value: "default"
    },

    // "featured" or "coming"
    label: {
      type: String,
      value: ""
    }
  },

  data: {
    stateSrc: ""
  },

  attached: function () {
    const allowedLabels = ["featured", "coming"]
    const { label } = this.data
    const stateSrc = allowedLabels.indexOf(label) >= 0
      ? `/static/images/${label}.png`
      : ""
    if (!stateSrc && label) {
      console.warn(`Passed invalid label: ${label}`)
    }
    this.setData({ stateSrc })
  }
});
