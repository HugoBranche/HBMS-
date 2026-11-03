# Hospital Booking Management System (HBMS)

A web-based system that lets patients book hospital appointments online and helps hospital staff manage those bookings, instead of relying on paper records and walk-ins.

**Live demo:** https://hugobranche.github.io/HBMS-/

**Status:** Release 1 (v1.0.0). See [RELEASE_1.md](RELEASE_1.md) for details.

---

## Problem

Many hospitals still handle appointments by phone, paper registers, or queues at the front desk. This causes long waiting times, double bookings, and lost records. HBMS provides a simple online way to book, view, and manage appointments.

## Features (Release 1)

> Edit this list so it matches what your project actually does.

- Landing page with an overview of the hospital and its services
- Appointment booking form (patient details, department/doctor, date and time)
- Basic form validation (required fields, valid dates)
- Responsive layout that works on phones and desktops

## Tech Stack

- HTML5
- CSS3
- JavaScript

> If you used PHP, Laravel, or a database, list them here and note that those parts cannot run on GitHub Pages.

## Project Structure

```
HBMS/
├── index.html      # Home page (entry point)
├── README.md       # Project overview
├── RELEASE_1.md    # Release 1 notes
└── ...             # Other pages, CSS, JS, images
```

## Running Locally

1. Clone the repository:
   ```
   git clone https://github.com/HugoBranche/HBMS-.git
   ```
2. Open the folder and double-click `index.html`, or open it with the VS Code **Live Server** extension.

No installation or build step is needed.

## Deployment

The site is hosted with GitHub Pages:

1. Go to **Settings > Pages**.
2. Set Source to **Deploy from a branch**, branch **main**, folder **/ (root)**.
3. The site is published at the link above after a minute or two.

## Known Limitations

- No real backend yet, so bookings are not stored permanently.
- No user accounts or login.
- No email or SMS confirmations.

## Roadmap

- Release 2: user accounts and login, a backend with a database, admin dashboard for staff
- Release 3: notifications, doctor schedules, reporting

## Author

**Hugo Branche Nkubito Cyusa**
Software Engineering, United States International University Africa (USIU Africa), Nairobi, Kenya
GitHub: [@HugoBranche](https://github.com/HugoBranche)

## License

This project is for academic purposes. Add a license here if you want others to reuse it.
Change control enforced via branch protection.
