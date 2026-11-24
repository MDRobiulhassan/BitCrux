import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, Mail, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the engineer behind BitCrux.",
};

const AboutPage = () => {
  return (
    <div className="mt-24 min-h-screen transition-colors">
      <section className="flex items-center px-4 pb-24 pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <Badge
              variant="secondary"
              className="mb-8 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300"
            >
              <Sparkles className="mr-2 size-4" />
              About the creator
            </Badge>

            <h1 className="mb-6 text-4xl font-black leading-tight text-gray-900 dark:text-white md:text-6xl">
              Hi, I&apos;m{" "}
              <span className="text-amber-600 dark:text-amber-400">
                Robiul Hassan
              </span>
            </h1>

            <p className="mb-8 text-xl font-semibold text-indigo-700 dark:text-indigo-300">
              Software Engineer
            </p>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 lg:mx-0">
              I build software and developer tools that make learning and
              problem-solving more approachable. BitCrux brings coding
              challenges, an online editor, and progress tracking together in
              one place.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-amber-500 text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-amber-600 hover:shadow-xl dark:bg-amber-400 dark:text-gray-900 dark:hover:bg-amber-500"
              >
                <Link href="/problems">
                  Explore Problems
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-300 dark:hover:bg-indigo-950"
              >
                <a href="mailto:robiulhassan.dev07@gmail.com">
                  <Mail className="mr-2 size-5" />
                  Get in touch
                </a>
              </Button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <div className="rotate-2 rounded-3xl bg-gradient-to-br from-amber-400 to-indigo-500 p-2 shadow-2xl">
              <Image
                src="/me.jpg"
                alt="Robiul Hassan"
                width={312}
                height={416}
                priority
                className="-rotate-2 aspect-[3/4] w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-24 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
              About{" "}
              <span className="text-amber-600 dark:text-amber-400">
                BitCrux
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              A focused space to practice coding, understand outcomes, and keep
              building your skills one problem at a time.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-gray-200 transition-shadow duration-200 hover:shadow-lg dark:border-gray-700">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300">
                  <Code2 className="size-6" />
                </div>
                <CardTitle>Practice with purpose</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Work through problems with examples, test cases, and an
                  editor for C++, Python, and Java.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-gray-200 transition-shadow duration-200 hover:shadow-lg dark:border-gray-700">
              <CardHeader>
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                  <Sparkles className="size-6" />
                </div>
                <CardTitle>Learn from every attempt</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Review test-case results, revisit submissions, and organize
                  problems into playlists as you progress.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
