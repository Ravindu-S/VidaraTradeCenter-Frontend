import React from "react";

const MyTickets = () => {
  return (
    <section className="mx-auto max-w-[900px] px-6 py-10 lg:px-12 lg:py-14">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Support Tickets
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Ticket list will be shown here.
        </p>
      </div>
    </section>
  );
};

export default MyTickets;
