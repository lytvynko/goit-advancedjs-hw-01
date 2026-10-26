const STORAGE_KEY = 'feedback-form-state';

const formData = {
  email: '',
  message: '',
};

const form = document.querySelector('.feedback-form');

const savedState = localStorage.getItem(STORAGE_KEY);

if (savedState) {
  try {
    const parsedState = JSON.parse(savedState);

    formData.email =
      typeof parsedState.email === 'string' ? parsedState.email.trim() : '';
    formData.message =
      typeof parsedState.message === 'string' ? parsedState.message.trim() : '';

    form.elements.email.value = formData.email;
    form.elements.message.value = formData.message;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

form.addEventListener('input', event => {
  const { name, value } = event.target;

  if (name !== 'email' && name !== 'message') {
    return;
  }

  formData[name] = value.trim();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
});

form.addEventListener('submit', event => {
  event.preventDefault();

  if (formData.email === '' || formData.message === '') {
    alert('Fill please all fields');
    return;
  }

  console.log({
    email: formData.email,
    message: formData.message,
  });

  localStorage.removeItem(STORAGE_KEY);
  formData.email = '';
  formData.message = '';
  form.reset();
});
