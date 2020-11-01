export function showToast(title, icon = 'none', duration = 1500) {
    const ret = wx.showToast({
        title,
        icon,
        duration
    })
    return ret
}

export function showModal(title = '', content = '', onConfirm = null, onCancel = null) {
    function onSuccess ({confirm}) {
        if (confirm && onConfirm) onConfirm()
        if (!confirm && onCancel) onCancel()
    }
    wx.showModal({
        title, content,
        success: onSuccess
    })
}
