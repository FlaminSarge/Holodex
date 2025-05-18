import { AboutFaqEmailForm } from "@/components/about/EmailForm";
import { AboutHeading } from "@/components/about/Heading";
import { useTranslation } from "react-i18next";
import { StyledExternalLink } from "./QuickLinks";

export function ContactList() {
  const { t } = useTranslation();
  const contactLinks = [
    {
      className: "max-w-xs",
      href: "https://twitter.com/messages/compose?recipient_id=1320894663084048384&text=Hello",
      icon: "i-logos:twitter",
      label: t("about.contact.twitter"),
    },
    {
      className: "max-w-xs",
      href: "https://discord.gg/jctkgHBt4b",
      icon: "i-logos:discord-icon",
      label: t("about.contact.discord"),
    },
  ];
  return (
    <div>
      <AboutHeading>Get in touch</AboutHeading>
      <p className="my-2 max-w-[700px] text-gray-500 dark:text-gray-400">
        Have a question or want to work together? We'd love to hear from you.
      </p>
      <div className="flex flex-wrap gap-2">
        {contactLinks.map((link, index) => (
          <StyledExternalLink key={index} {...link} />
        ))}
      </div>
      <div className="h-4"></div>
      <AboutHeading>{t("about.contact.email")}</AboutHeading>
      <AboutFaqEmailForm />
    </div>
  );
}
