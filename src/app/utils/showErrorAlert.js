import Swal from 'sweetalert2';

export function showErrorAlert(title = 'Error', text = 'Something went wrong!') {
  Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#d33',
  });
}