Bewerberaufgabe: KI-System-Check
Die Aufgabe
Entwickle eine kleine Web-Anwendung, mit der ein Unternehmen einzelne KI-Systeme erfassen und
bewerten kann
.Viele Unternehmen nutzen bereits KI-Tools oder planen ihren Einsatz – etwa Chatbots, Copilots, Systeme
zur Bewerbervorauswahl oder KI-gestützte Auswertungen. Häufig fehlt jedoch ein klarer Überblick:
• Welche KI-Systeme werden überhaupt eingesetzt?
• Wo entstehen Risiken für Daten, Mitarbeiter, Kunden oder Entscheidungen?
• Welche Anforderungen oder offenen Punkte sind zu prüfen?
• Was sollte das Unternehmen als Nächstes konkret tun?
Deine Anwendung soll diese Fragen für ein einzelnes KI-System verständlich beantworten. Sie soll keine
Rechtsberatung ersetzen und keine endgültige Konformität behaupten. Ihr Zweck ist es, Risiken und
Handlungsbedarf früh sichtbar zu machen, fehlende Informationen gezielt abzufragen und daraus
sinnvolle nächste Schritte abzuleiten.
Die Anwendung richtet sich an Geschäftsführer, Bereichsleiter und KI-Verantwortliche – nicht an
Entwickler oder Juristen. Sie soll deshalb klar, ruhig, vertrauenswürdig und entscheidungsorientiert
wirken.

Was die Anwendung können soll
1. KI-System erfassen
Ein Nutzer soll ein KI-System über einen übersichtlichen Fragebogen anlegen können.
Erfasse mindestens folgende Informationen:
Bereich Angaben
Grunddaten Name, kurze Beschreibung, Fachbereich, Status: Idee / Pilot / produktiv
Zweck Welches Problem löst das System? Welchen Prozess unterstützt es?
KI-Einsatz Art der KI, Anbieter bzw. Modell, interne oder externe Nutzung
Betroffene Mitarbeiter, Kunden, Bewerber, Öffentlichkeit oder keine externen Personen
Entscheidung Informiert das System nur, unterstützt es Entscheidungen oder trifft es sie teilweise bzw. vollständig

automatisiert?

Daten Werden personenbezogene, besonders schützenswerte oder vertrauliche Unternehmensdaten

verarbeitet?

Kontrolle Gibt es menschliche Prüfung, Freigaben, Output-Kontrollen oder Protokollierung?
Transparenz Interagieren Menschen direkt mit KI? Werden KI-generierte Inhalte veröffentlicht? Gibt es einen Hinweis

darauf?

Verantwortung Wer ist fachlich verantwortlich? Gibt es Schulungen oder klare Nutzungsregeln?

Du entscheidest selbst, welche Eingaben als Auswahlfeld, Freitext oder Folgefrage sinnvoll sind. Wichtig
ist, dass der Fragebogen verständlich bleibt und nur relevante Informationen abfragt.
2. Bewertung auf zwei Wegen
Nach dem Erfassen soll die Anwendung eine erste Einschätzung erstellen. Dabei sollst du zwei
unterschiedliche Ansätze zeigen:
A. Feste Regeln
Baue eine nachvollziehbare Regel-Logik, die aus den Angaben konkrete Hinweise und Maßnahmen
ableitet. Die Regeln müssen nicht vollständig sein, aber klar strukturiert, testbar und erweiterbar.

Beispiele:
Wenn Dann
Externe Personen nutzen einen KI-Chatbot und ein Hinweis auf
KI-Nutzung fehlt

Hinweis und Maßnahme: Transparenzhinweis prüfen
und umsetzen

KI unterstützt die Auswahl oder Priorisierung von Bewerbern Fachliche bzw. rechtliche Prüfung erforderlich; keine

endgültige automatische Einordnung

Personenbezogene oder vertrauliche Daten gehen an einen
externen KI-Anbieter und Freigaben sind unklar

Datenschutz-, Anbieter- und Freigabeprüfung
erforderlich

KI beeinflusst Entscheidungen über Personen und menschliche
Kontrolle fehlt

Menschliche Prüfung, Eingriffsmöglichkeit und
Eskalationsweg definieren

Nutzer verwenden KI, aber Schulung und klare Regeln fehlen Schulung und verbindliche Nutzungsregeln planen
Wesentliche Angaben fehlen oder sich widersprechen Keine sichere Aussage; offene Punkte klar ausweisen

Die Regel-Logik darf nicht nur im Frontend liegen. Sie soll versionierbar und nachvollziehbar sein, zum
Beispiel über eine JSON-Datei, Datenbanktabelle oder eine klar abgegrenzte Backend-Logik.
B. LLM-gestützte Einschätzung
Binde zusätzlich ein LLM an. Du kannst dafür einen kostenfreien oder kostengünstigen Anbieter wählen.
Das LLM soll die Antworten in verständlicher Geschäftssprache zusammenfassen und zum Beispiel helfen
bei:
• einer kurzen Erläuterung der wesentlichen Risiken,
• der Formulierung offener Fragen,
• einer verständlichen Erklärung der empfohlenen nächsten Schritte.
Zeige in der Oberfläche deutlich, welche Ergebnisse aus festen Regeln stammen und welche Inhalte durch
ein LLM erstellt wurden.
Das LLM darf keine verbindliche Rechts- oder Compliance-Aussage treffen. Es soll die regelbasierte
Einschätzung erklären und ergänzen, nicht ersetzen. Beschreibe kurz, wie du Prompting, Fehlerfälle,
Kostenkontrolle und den Umgang mit sensiblen Daten gelöst hast.

3. Ergebnisansicht
Nach der Bewertung soll eine übersichtliche Ergebnisansicht erscheinen. Sie sollte mindestens zeigen:
• Gesamteinschätzung: unauffällig / Handlungsbedarf / Prüfung erforderlich
• Die wichtigsten Gründe für die Einschätzung
• Konkrete nächste Schritte mit Priorität
• Offene oder fehlende Informationen
• Klarer Hinweis, wenn eine fachliche oder rechtliche Prüfung erforderlich ist
• Regelversion und Zeitpunkt der Bewertung
Die Darstellung sollte einem Entscheider schnell vermitteln: Was ist das Thema, warum ist es wichtig
und was sollten wir jetzt tun?
Demo-Fälle
Lege mindestens diese drei Beispiele als Demo-Daten an oder ermögliche, sie schnell zu erfassen:
Kundenservice-Chatbot
• Generative KI auf einer Website
• Kunden interagieren direkt mit dem System
• Kein dokumentierter Hinweis auf KI-Nutzung
• Antworten werden nicht vorab durch Menschen geprüft
CV-Vorsortierung
• KI priorisiert eingehende Bewerbungen
• Bewerberdaten werden verarbeitet
• Die finale Entscheidung trifft ein Mensch
• Qualitäts- oder Bias-Prüfungen sind nicht dokumentiert

Interner Vertriebs-Copilot
• Mitarbeiter erstellen damit Angebotsentwürfe und Kundenkommunikation
• Externer KI-Anbieter
• Kundendaten könnten in Eingaben enthalten sein
• Schulung, Freigabeprozess und Nutzungsregeln sind unklar
Sicherheit und Nachvollziehbarkeit
Berücksichtige mindestens folgende Punkte:
• Eingaben auf dem Server validieren; kritische Regeln nicht nur im Browser ausführen
• Schutz gegen typische Eingabeangriffe wie XSS oder Injection
• Keine API-Keys oder Secrets im Repository oder im Frontend
• LLM-Aufrufe über ein Backend; keine sensiblen Demo-Daten an das Modell senden
• Fiktive Daten verwenden; keine echten personenbezogenen Daten
• Bewertungsergebnisse mit Zeitstempel und Regelversion speichern
• Änderungen und Neubewertungen nachvollziehbar machen
• Fehlende oder widersprüchliche Angaben transparent behandeln, statt eine scheinbar sichere
Aussage zu erzeugen
• Status nicht nur über Farben vermitteln
Eine vollständige Enterprise-Security-Lösung wird nicht erwartet. Wichtig ist, dass du relevante Risiken
erkennst, angemessene Maßnahmen umsetzt und verbleibende Grenzen offen benennst.
Recherche
Arbeite dich in die für diese Aufgabe relevanten Aspekte des EU AI Act ein. Eine vollständige Abdeckung
ist nicht erforderlich.
Relevant sind insbesondere:
• Transparenz bei Interaktion mit KI und KI-generierten Inhalten
• KI-Kompetenz und Schulung von Nutzern
• Menschliche Kontrolle bei KI-gestützten Entscheidungen

• Dokumentation und Nachvollziehbarkeit
• Grenzen automatisierter rechtlicher Einschätzungen
Nutze bevorzugt offizielle EU-Quellen und dokumentiere im README die Quellen sowie den zugrunde
gelegten Rechtsstand.
Mögliche Startpunkte:
• https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
• https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act
• https://eur-lex.europa.eu/eli/reg/2024/1689/oj
Technische Freiheit
Stack, Architektur und Deployment kannst du frei wählen.
Erkläre im README kurz:
• wie du Datenmodell, Backend, Oberfläche und Regel-Logik aufgebaut hast,
• wie die LLM-Anbindung funktioniert,
• welche Sicherheitsmaßnahmen du umgesetzt hast,
• welche Annahmen du getroffen hast,
• welche Grenzen oder sinnvollen nächsten Ausbaustufen du siehst.
Ein klarer, sauberer und lokal reproduzierbarer Prototyp ist wichtiger als unnötig viel Infrastruktur oder
eine große Zahl an Features.
Abgabe
Bitte liefere:
1. Repository-Link mit vollständigem, lauffähigem Code
2. README.md mit Setup, Architektur, Quellen, Annahmen und Grenzen
3. AI_USAGE.md mit einer kurzen Beschreibung:
o Welche KI-Tools du im Entwicklungsprozess genutzt hast
o Wofür du sie genutzt hast
o Welche Ergebnisse du selbst überprüft, angepasst oder verworfen hast

4. Ein kurzes Demo-Video von maximal 8 Minuten. Zeige darin:
o die Anwendung anhand eines Demo-Falls,
o die regelbasierte Bewertung,
o die LLM-gestützte Ergänzung,
o eine Sicherheitsentscheidung,
o und ein Beispiel dafür, wo das System bewusst keine abschließende Aussage trifft.
Optional, aber willkommen: automatisierte Tests für die Regel-Logik und kritische Validierungen.
Viel Erfolg.