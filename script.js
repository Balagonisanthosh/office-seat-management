const roomConfig = {
  dev:   { name: "Development Room", layout: "u", seats: 12 },
  test:  { name: "Testing Room", layout: "u", seats: 10 },
  hr:    { name: "HR Room", layout: "u", seats: 8 },
  mgmt:  { name: "Management Cabin", layout: "u", seats: 6 },
  conf:  { name: "Conference Hall", layout: "row", seats: 16 },
  train: { name: "Training Room", layout: "row", seats: 14 }
};

let bookings = JSON.parse(localStorage.getItem("officeBookings")) || {};
let currentRoom = null;
let selectedSeat = null;

const roomModal = document.getElementById("roomModal");
const confirmModal = document.getElementById("confirmModal");
const seatLayout = document.getElementById("seatLayout");
const roomTitle = document.getElementById("roomTitle");
const confirmText = document.getElementById("confirmText");

/* Open Room */
function openRoom(roomKey) {
  currentRoom = roomKey;
  roomTitle.textContent = roomConfig[roomKey].name;
  renderSeats(roomKey);
  roomModal.style.display = "flex";
}

function closeRoom() {
  roomModal.style.display = "none";
}

/* Render Seats */
function renderSeats(roomKey) {
  seatLayout.innerHTML = "";
  const { layout, seats } = roomConfig[roomKey];

  if (layout === "u") {
    const left = document.createElement("div");
    const right = document.createElement("div");
    const bottom = document.createElement("div");

    left.className = right.className = "u-col";
    bottom.className = "bottom-row";

    for (let i = 1; i <= seats; i++) {
      const seatId = `${roomKey}-${i}`;
      const seat = createSeat(seatId);

      if (i <= seats / 3) left.appendChild(seat);
      else if (i <= (2 * seats) / 3) right.appendChild(seat);
      else bottom.appendChild(seat);
    }

    const uShape = document.createElement("div");
    uShape.className = "u-shape";
    uShape.append(left, right);

    seatLayout.append(uShape, bottom);
  } else {
    const row = document.createElement("div");
    row.className = "row-layout";

    for (let i = 1; i <= seats; i++) {
      row.appendChild(createSeat(`${roomKey}-${i}`));
    }
    seatLayout.appendChild(row);
  }
}

/* Create Seat */
function createSeat(seatId) {
  const seat = document.createElement("button");
  seat.textContent = seatId.split("-")[1];
  seat.className = "seat";

  if (bookings[seatId]) {
    seat.classList.add("booked");
  } else {
    seat.classList.add("available");
    seat.onclick = () => openConfirm(seatId);
  }
  return seat;
}

/* Confirm Booking */
function openConfirm(seatId) {
  selectedSeat = seatId;
  confirmText.textContent = `Confirm booking for seat ${seatId}?`;
  confirmModal.style.display = "flex";
}

function confirmBooking() {
  bookings[selectedSeat] = true;
  localStorage.setItem("officeBookings", JSON.stringify(bookings));

  confirmModal.style.display = "none";
  renderSeats(currentRoom);
  updateCounts();

  alert(`Chair ${selectedSeat.toUpperCase()} booked successfully!`);
}

function closeConfirm() {
  confirmModal.style.display = "none";
}

/* Update Totals, Available & Booked */
function updateCounts() {
  Object.keys(roomConfig).forEach(room => {
    const total = roomConfig[room].seats;
    const booked = Object.keys(bookings).filter(k => k.startsWith(room)).length;
    const available = total - booked;

    document.getElementById(room + "Total").textContent =
      `Total Seats: ${total}`;

    document.getElementById(room + "Available").textContent =
      `Available Seats: ${available}`;

    document.getElementById(room + "Booked").textContent =
      `Booked Seats: ${booked}`;
  });
}

/* Initial Load */
updateCounts();
