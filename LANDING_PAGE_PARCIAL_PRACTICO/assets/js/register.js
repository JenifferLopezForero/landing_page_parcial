(function () {
    const $ = (sel) => document.querySelector(sel);
    const form = $('#signupForm');
    if (!form) return;

    const fields = {
        fullName: $('#fullName'),
        email: $('#email'),
        password: $('#password'),
        confirm: $('#confirm'),
        birthdate: $('#birthdate'),
        cell: $('#cell'),
        phone: $('#phone'),
        terms: $('#terms')
    };

    const errors = {
        fullName: $('#err-fullName'),
        email: $('#err-email'),
        password: $('#err-password'),
        confirm: $('#err-confirm'),
        birthdate: $('#err-birthdate'),
        cell: $('#err-cell'),
        phone: $('#err-phone'),
        terms: $('#err-terms'),
    };

    const submitBtn = $('#submitBtn');
    const successMsg = $('#successMsg');

    // ---------- helpers de UI ----------
    function setValid(input, msg = '') {
        input.classList.remove('invalid');
        input.classList.add('valid');
        const err = errors[input.id];
        if (err) err.textContent = msg;
    }

    function setInvalid(input, msg) {
        input.classList.remove('valid');
        input.classList.add('invalid');
        const err = errors[input.id];
        if (err) err.textContent = msg || 'Campo inválido';
    }

    function clearState(input) {
        input.classList.remove('valid', 'invalid');
        const err = errors[input.id];
        if (err) err.textContent = '';
    }

    // ---------- validaciones ----------
    function valFullName() {
        const v = fields.fullName.value.trim();
        if (v.length < 3) { setInvalid(fields.fullName, 'Mínimo 3 caracteres.'); return false; }
        setValid(fields.fullName); return true;
    }

    function valEmail() {
        if (!fields.email.validity.valid) {
            setInvalid(fields.email, 'Ingresa un correo válido.');
            return false;
        }
        setValid(fields.email); return true;
    }

    // Al menos: 1 minúscula, 1 mayúscula, 1 número y 1 símbolo, 8+ chars
    const passRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    function valPassword() {
        const v = fields.password.value;
        if (!passRe.test(v)) {
            setInvalid(fields.password, 'Min. 8 caracteres e incluye: mayúscula, minúscula, número y símbolo.');
            return false;
        }
        setValid(fields.password); return true;
    }

    function valConfirm() {
        if (!fields.confirm.value) { setInvalid(fields.confirm, 'Repite tu contraseña.'); return false; }
        if (fields.confirm.value !== fields.password.value) {
            setInvalid(fields.confirm, 'Las contraseñas no coinciden.');
            return false;
        }
        setValid(fields.confirm); return true;
    }

    // Debe ser mayor o igual a 18 años
    function valBirthdate() {
        const v = fields.birthdate.value;
        if (!v) { setInvalid(fields.birthdate, 'Selecciona tu fecha de nacimiento.'); return false; }
        const birth = new Date(v);
        const now = new Date();
        const age18 = new Date(birth.getFullYear() + 18, birth.getMonth(), birth.getDate());
        if (age18 > now) { setInvalid(fields.birthdate, 'Debes ser mayor de 18 años.'); return false; }
        setValid(fields.birthdate); return true;
    }

    // Colombia: 3xxxxxxxxx o +57 3xxxxxxxxx
    const cellRe = /^(\+?57\s*)?(3\d{9})$/;
    function valCell() {
        const v = fields.cell.value.replace(/\s+/g, '');
        if (!cellRe.test(v)) { setInvalid(fields.cell, 'Formato: 3xxxxxxxxx (acepta +57 opcional).'); return false; }
        setValid(fields.cell); return true;
    }

    // Opcional: si escribe, deben ser 10 dígitos
    const phoneRe = /^\d{10}$/;
    function valPhone() {
        const v = fields.phone.value.trim();
        if (v === '') { clearState(fields.phone); return true; }
        if (!phoneRe.test(v)) { setInvalid(fields.phone, 'Debe tener 10 dígitos si lo ingresas.'); return false; }
        setValid(fields.phone); return true;
    }

    function valTerms() {
        if (!fields.terms.checked) { errors.terms.textContent = 'Debes aceptar los términos.'; return false; }
        errors.terms.textContent = ''; return true;
    }

    // ---------- orquestador ----------
    const validators = [valFullName, valEmail, valPassword, valConfirm, valBirthdate, valCell, valPhone, valTerms];

    function checkForm() {
        const ok = validators.every(fn => fn());
        submitBtn.disabled = !ok;
        return ok;
    }

    // listeners en vivo
    fields.fullName.addEventListener('input', () => { valFullName(); checkForm(); });
    fields.email.addEventListener('input', () => { valEmail(); checkForm(); });
    fields.password.addEventListener('input', () => { valPassword(); valConfirm(); checkForm(); });
    fields.confirm.addEventListener('input', () => { valConfirm(); checkForm(); });
    fields.birthdate.addEventListener('change', () => { valBirthdate(); checkForm(); });
    fields.cell.addEventListener('input', () => { valCell(); checkForm(); });
    fields.phone.addEventListener('input', () => { valPhone(); checkForm(); });
    fields.terms.addEventListener('change', () => { valTerms(); checkForm(); });

    // submit y reset
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!checkForm()) return;

        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 4000);

        // Simula “envío ok” sin servidor
        form.reset();

        // limpia estados visuales
        Object.values(fields).forEach(el => el.classList && el.classList.remove('valid', 'invalid'));
        Object.values(errors).forEach(el => el.textContent = '');
        submitBtn.disabled = true;
    });

    form.addEventListener('reset', () => {
        setTimeout(() => {
            Object.values(fields).forEach(el => el.classList && el.classList.remove('valid', 'invalid'));
            Object.values(errors).forEach(el => el.textContent = '');
            submitBtn.disabled = true;
            successMsg.classList.remove('show');
        }, 0);
    });

    // primera evaluación al cargar
    checkForm();
})();
