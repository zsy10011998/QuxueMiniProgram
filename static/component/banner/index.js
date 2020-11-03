Component({
  externalClasses: ['loop-banner'],

  properties:
  {
    // 轮转显示的文字
    texts: {
      type: Array,
      value: []
    },

    // 颜色
    theme: {
      type: String,
      value: ''
    },

    // 能否点击清除
    hidable: {
      type: Boolean,
      value: true
    }
  },

  data: {
    interval: null,
    displayIndex: 0,
    opacity: 1,
    display: true
  },

  attached: function () {
    this.setCurrentInterval()
  },

  detached: function () {
    this.clearCurrentInterval ()
  },

  observers: {
    'texts': function (_) {
      this.setCurrentInterval()
    }
  },

  methods: {
    setCurrentInterval () {
      const { texts } = this.data
      const $this = this

      this.clearCurrentInterval ()
      if (texts && texts.length) {
        this.setData({ displayIndex: 0})

        if (texts.length > 1) {
          const interval = setInterval(() => {
            const index = $this.data.displayIndex
            setTimeout(() => {
              $this.setData({ opacity: 0 })
            }, 1500)
            setTimeout(() => {
              $this.setData({ displayIndex: (index + 1) % texts.length})
            }, 2000)
            setTimeout(() => {
              $this.setData({ opacity: 1 })
            }, 2000)
          }, 4500)

          this.setData({ interval })
        }
      }
    },

    clearCurrentInterval () {
      if (this.data.interval) {
        clearInterval(this.interval)
        this.setData({ interval: null })
      }
    },

    close () {
      if (!this.data.hidable) return
      this.clearCurrentInterval()
      this.setData({ display: false })
    }
  }
});
