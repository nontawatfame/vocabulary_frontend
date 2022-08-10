import Swal from "sweetalert2"

export const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    // allowOutsideClick: false,
    showCloseButton: true,
    showConfirmButton: false,
    timer: 1200,
    // timerProgressBar: true,
    // didOpen: (toast) => {
    //   toast.addEventListener('mouseenter', Swal.stopTimer)
    //   toast.addEventListener('mouseleave', Swal.resumeTimer)
    // }
  })

export function error(title: string ,msg: string) {
    return Toast.fire({
        icon: 'error',
        title: title,
        text: msg
    })
}

export function success(title: string ,msg: string) {
    Toast.fire({
        icon: 'success',
        title: title,
        text: msg
    })
}



