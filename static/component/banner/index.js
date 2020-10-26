Component({
  externalClasses: ['loop-banner'],

  properties:
  {
    // 轮转显示的文字
    texts: {
      type: Array,
      value: []
    },

    // 背景颜色
    backgroundColor: {
      type: String,
      value: '#fff2e8'
    },

    // 边框颜色
    borderColor: {
      type: String,
      value: '#ffbb96'
    },

    // 文字颜色
    color: {
      type: String,
      value: '#fa541c'
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
      this.clearCurrentInterval()
      this.setData({ display: false })
    }
  }
});
