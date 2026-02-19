import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      <header class="bg-blue-600 dark:bg-blue-800 text-white p-4 shadow-md">
        <div class="container mx-auto flex justify-between items-center">
          <h1 class="text-xl font-bold">Fuel Tracker</h1>
          <nav>
            <ul class="flex space-x-4">
              <li><a href="#" class="hover:text-blue-200 transition-colors">Home</a></li>
              <li><a href="#" class="hover:text-blue-200 transition-colors">Entries</a></li>
              <li><a href="#" class="hover:text-blue-200 transition-colors">Profile</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main class="container mx-auto p-4 flex-grow">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mt-8 max-w-2xl mx-auto border border-slate-200 dark:border-slate-700">
          <h2 class="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Welcome to Fuel Tracker</h2>
          <p class="text-slate-600 dark:text-slate-400 text-lg">
            This is your new Angular UI with Tailwind CSS.
            It automatically switches between light and dark themes based on your system settings.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition duration-200 shadow-md">
              Get Started
            </button>
            <button class="border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold py-3 px-8 rounded-md transition duration-200">
              Learn More
            </button>
          </div>
        </div>
      </main>

      <footer class="py-6 text-center text-slate-500 dark:text-slate-400 text-sm border-t border-slate-100 dark:border-slate-800">
        &copy; 2026 Fuel Tracker App • Built with Angular & Tailwind
      </footer>
    </div>
    <router-outlet />
  `,
  styles: [],
})
export class App {
  title = 'fuel-tracker-ui';
}
