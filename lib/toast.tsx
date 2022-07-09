import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    allowOutsideClick: true,
    showCloseButton: true,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    // didOpen: (toast) => {
    //   toast.addEventListener('mouseenter', Swal.stopTimer)
    //   toast.addEventListener('mouseleave', Swal.resumeTimer)
    // }
})

const toast = withReactContent(Toast)

export function error(msg: string) {
    toast.fire({
        icon: 'error',
        title: <strong style={{fontSize: "22px"}}>Error</strong>,
        text: msg
    })
}

export function success(msg: string) {
    toast.fire({
        icon: 'success',
        title: <strong style={{fontSize: "22px"}}>Success</strong>,
        text: msg
    })
}


export {toast}

