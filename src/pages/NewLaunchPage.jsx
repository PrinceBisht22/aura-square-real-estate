import React from 'react';
import Carousel from '../components/Carousel';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';

const NewLaunchPage = () => {
  const newLaunchProjects = projects.filter(
    (project) => project.status === 'New Launch',
  );

  return (
    <div className="space-y-12 pb-16">
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="New launch hero"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center">
          <div className="space-y-4 md:w-2/3">
            <p className="floating-chip bg-white/20 text-white/90">New Launch</p>
            <h1 className="text-4xl font-display font-semibold">
              Launch-ready projects from India’s top developers
            </h1>
            <p className="text-lg text-white/80">
              Unlock early-bird pricing, priority allotments, and exclusive payment plans.
              Every project listed is RERA compliant and curated by Aura Square experts.
            </p>
          </div>
          <div className="rounded-3xl bg-white/10 p-6 text-center">
            <p className="text-sm uppercase tracking-wide text-white/80">
              Inventory open now
            </p>
            <p className="text-4xl font-display">{newLaunchProjects.length}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
        <div>
          <p className="floating-chip text-navy">Swipe through launches</p>
          <h2 className="section-heading mt-3">
            Project showcases with rich media
          </h2>
        </div>
        <Carousel
          items={newLaunchProjects}
          renderItem={(project) => <ProjectCard project={project} />}
        />
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        <div>
          <p className="floating-chip text-navy">All launches</p>
          <h2 className="section-heading mt-3">
            Shortlist by city, configuration, and possession date
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {newLaunchProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default NewLaunchPage;

