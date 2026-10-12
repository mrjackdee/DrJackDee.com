(() => {
  const form = document.querySelector('#order-form');
  const button = document.querySelector('#submit-button');
  const status = document.querySelector('#form-status');
  const endpoint = window.TEAMPINK_SCRIPT_URL;
  const orderId = crypto.randomUUID();
  let pending = false, lastMail = false, timer;
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint || '')) {
    document.querySelector('#setup-notice').hidden = false;
    button.disabled = true;
    return;
  }
  window.addEventListener('message', event => {
    if (!pending || !/^https:\/\/[a-z0-9-]+-script\.googleusercontent\.com$/.test(event.origin) && event.origin !== 'https://script.googleusercontent.com') return;
    const result = event.data;
    if (!result || result.type !== 'teampink-order' || result.orderId !== orderId) return;
    clearTimeout(timer);
    pending = false;
    button.disabled = false;
    if (!result.success) {
      status.classList.add('error');
      status.textContent = result.error || 'Your order could not be submitted. Please try again.';
      return;
    }
    form.hidden = true;
    const confirmation = document.querySelector('#confirmation');
    confirmation.hidden = false;
    document.querySelector('#delivery-confirmation').textContent = lastMail ? 'You requested mailing to the address you provided.' : 'You requested that your tumbler not be mailed.';
    document.querySelector('#order-reference').textContent = 'Order reference: ' + orderId;
    confirmation.focus();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    const values = new FormData(form);
    const phone = values.get('phone').trim();
    if (phone.replace(/\D/g, '').length < 7) {
      status.classList.add('error');
      status.textContent = 'Please enter a valid phone number.';
      document.querySelector('#phone').focus();
      return;
    }
    for (const name of ['name','address','phone','email']) {
      if (!values.get(name).trim()) {
        document.getElementById(name).focus();
        status.classList.add('error');
        status.textContent = 'Please complete all contact fields.';
        return;
      }
    }
    pending = true;
    lastMail = values.has('mail');
    button.disabled = true;
    status.classList.remove('error');
    status.textContent = 'Submitting your order…';
    const transport = document.createElement('form');
    transport.action = endpoint; transport.method = 'POST'; transport.target = 'teampink-submission'; transport.hidden = true;
    const payload = {name:values.get('name').trim(),address:values.get('address').trim(),phone,email:values.get('email').trim(),mail:String(lastMail),website:values.get('website'),orderId,origin:window.location.origin};
    for (const [name,value] of Object.entries(payload)) {
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = name; input.value = value;
      transport.appendChild(input);
    }
    document.body.appendChild(transport);
    transport.submit(); transport.remove();
    timer = setTimeout(() => {
      pending = false; button.disabled = false;
      status.classList.add('error');
      status.textContent = 'We could not confirm your order. Please submit again; your order reference prevents duplicate orders.';
    }, 45000);
  });
})();
