describe('Search for automation on Google and check Wikipedia', () => {
      beforeEach(() => {
    // Log page errors for debugging
    cy.on('window:load', (win) => {
      win.onerror = (message, source, lineno) => {
        console.log(`Page error: ${message} at ${source}:${lineno}`);
      };
    });
  });
  it('should search Google, find Wikipedia, check year, and take screenshot', () => {
    // Step 1: Visit Google
    cy.visit('https://www.google.com', { timeout: 10000 }, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    // Step 2: Handle Google consent screen if present
    cy.get('body').then(($body) => {
      if ($body.find('button[id="W0wltc"]').length > 0) {
        cy.get('button[id="W0wltc"]').click();
      }
    });

    // Step 3: Find search input, type "automation", and submit
    cy.get('input[name="q"], textarea[name="q"]', { timeout: 10000 })
      .should('be.visible')
      .type('automation{enter}');

    // Step 4: Wait for search results and find Wikipedia link
    cy.get('a[href*="en.wikipedia.org/wiki/Automation"]', { timeout: 10000 })
      .should('be.visible')
      .invoke('attr', 'href')
      .then((href) => {
        if (!href) throw new Error('Wikipedia link not found');

        // Step 5: Visit Wikipedia page using cy.origin
        cy.origin('https://en.wikipedia.org', () => {
          cy.visit(href);

          // Step 6: Find the year 1785 after the "Oliver Evans" link
           cy.get('a:contains("Oliver Evans")').parent().invoke('text').then((text) => {
            const yearMatch = text.match(/\b\d{4}\b/); // Match a 4-digit number
            expect(yearMatch[0]).to.equal('1785'); // Verify the year is 1785
          });

          // Step 7: Take screenshot
          cy.screenshot('wikipedia_automation', { capture: 'fullPage' });
        });
  });
        }   );
  }
);
