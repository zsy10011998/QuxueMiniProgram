export function isnull(content) {
    if (content === '') {
        return true
    }
    const reg = '^[ ]+$'
    const re = new RegExp(reg)
    return re.test(content)
}

export function scrollbottom() {
    wx.createSelectorQuery().select('#list').boundingClientRect(function (rect) {
        wx.pageScrollTo({
            scrollTop: rect.height
        })
    }).exec()
}
