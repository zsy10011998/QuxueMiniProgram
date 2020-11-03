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
    display: true,
    timeout1: null,
    timeout2: null,
    timeout3: null
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
      let {timeout1, timeout2, timeout3} = this.data

      this.clearCurrentInterval ()
      if (texts && texts.length) {
        this.setData({ displayIndex: 0})

        if (texts.length > 1) {
          const interval = setInterval(() => {
            const index = $this.data.displayIndex
            timeout1 = setTimeout(() => {
              $this.setData({ opacity: 0 })
            }, 1500)
            timeout2 = setTimeout(() => {
              $this.setData({ displayIndex: (index + 1) % texts.length})
            }, 2000)
            timeout3 = setTimeout(() => {
              $this.setData({ opacity: 1 })
            }, 2000)
          }, 4500)

          this.setData({ interval, timeout1, timeout2, timeout3 })
        }
      }
    },

    clearCurrentInterval () {
      const {timeout1, timeout2, timeout3, interval} = this.data
      if (interval) {
        clearInterval(interval)
        clearTimeout(timeout1)
        clearTimeout(timeout2)
        clearTimeout(timeout3)
        this.setData({ 
          interval: null,
          timeout1: null,
          timeout2: null,
          timeout3: null
        })
      }
    },

    close () {
      if (!this.data.hidable) return
      this.clearCurrentInterval()
      this.setData({ display: false })
    }
  }
});
