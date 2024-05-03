import Swal from "sweetalert2";

export const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

export const showErrorToast = (condition: any, message: string) => {
    if (condition)
        Toast.fire({
            icon: 'error',
            title: message
        })
}

export const deleteConfirmation = (preform: any) => {
    Swal.fire({
        title: 'Etes vous sure?',
        text: "Vous ne pourrez plus revenir en arrière!",
        icon: 'warning',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui!',
        cancelButtonText: 'Retour',
        preConfirm: preform
    }).then(async (result) => {
    })
}
