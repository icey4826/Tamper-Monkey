// ==UserScript==
// @name         Procore Buttons v4 (Custom Solutions)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Procore Buttons to simplify bookmarklet usage and added additional more complex buttons
// @match        https://app.procore.com/*
// @match        https://us02.procore.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=procore.com
// @author       Ivan Petrov
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to add a dropdown menu with customizable position
    function addDropdownMenu(text, buttonOptions, top = '20%', left = '50%') {
        var dropdownContainer = document.createElement('div');
        dropdownContainer.style.position = 'absolute';
        dropdownContainer.style.top = top;
        dropdownContainer.style.left = left;
        dropdownContainer.style.transform = 'translateX(-50%)';
        dropdownContainer.style.zIndex = '10000000';

        var button = document.createElement('button');
        button.innerHTML = `<span>${text}</span>`;
        button.className = 'button-64';
        button.style.padding = '4px 11px';
        button.style.fontSize = '13px';
        button.style.minWidth = '100px';
        button.style.backgroundImage = 'linear-gradient(144deg,#000000 70%, #FF8C00 85%, #FFA500)';
        button.style.border = '0';
        button.style.borderRadius = '8px';
        button.style.boxShadow = 'rgba(151, 65, 252, 0.2) 0 15px 30px -5px';
        button.style.boxSizing = 'border-box';
        button.style.color = 'white';
        button.style.display = 'flex';
        button.style.fontFamily = 'Phantomsans, sans-serif';
        button.style.justifyContent = 'center';
        button.style.lineHeight = '1em';
        button.style.textDecoration = 'none';
        button.style.userSelect = 'none';
        button.style.webkitUserSelect = 'none';
        button.style.touchAction = 'manipulation';
        button.style.whiteSpace = 'nowrap';
        button.style.cursor = 'pointer';

        button.onmouseover = function() {
            this.style.backgroundImage = 'linear-gradient(144deg, #000000, #FF8C00 50%, #FFA500)';
        };
        button.onmouseout = function() {
            this.style.backgroundImage = 'linear-gradient(144deg, #000000 70%, #FF8C00 85%, #FFA500)';
        };

        var dropdownContent = document.createElement('div');
        dropdownContent.style.display = 'none';
        dropdownContent.style.position = 'absolute';
        dropdownContent.style.backgroundColor = '#f9f9f9';
        dropdownContent.style.minWidth = '160px';
        dropdownContent.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
        dropdownContent.style.zIndex = '1';
        dropdownContent.style.flexDirection = 'column';
        dropdownContent.style.padding = '10px';
        dropdownContent.style.borderRadius = '8px';

        buttonOptions.forEach(function(option) {
            var optionButton = document.createElement('button');
            optionButton.innerHTML = option.text;
            optionButton.style.padding = '10px';
            optionButton.style.border = 'none';
            optionButton.style.background = 'Black';
            optionButton.style.cursor = 'pointer';
            optionButton.style.width = '100%';
            optionButton.style.textAlign = 'left';

            optionButton.onmouseover = function() {
                optionButton.style.backgroundColor = '#ddd';
            };
            optionButton.onmouseout = function() {
                optionButton.style.backgroundColor = 'black';
            };

            optionButton.onclick = function(event) {
                event.stopPropagation(); // Prevent the click from closing the dropdown
                option.onClickFunction();
                dropdownContent.style.display = 'none'; // Close the dropdown after selection
            };

            dropdownContent.appendChild(optionButton);
        });

        // Toggle dropdown on button click
        button.onclick = function(event) {
            event.stopPropagation(); // Prevent this click from immediately closing the dropdown
            dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'flex' : 'none';
        };

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!dropdownContainer.contains(event.target)) {
                dropdownContent.style.display = 'none';
            }
        });

        dropdownContainer.appendChild(button);
        dropdownContainer.appendChild(dropdownContent);
        document.body.insertBefore(dropdownContainer, document.body.firstChild);

        // Return the container for potential future use
        return dropdownContainer;
    }

    function extractCompanyIdAndNavigate() {
        let companyId = null;
        
        // First try to get companyId from Procore.Environment
        if (window.Procore && window.Procore.Environment && window.Procore.Environment.companyId) {
            companyId = window.Procore.Environment.companyId;
        }
        
        // Fallback to URL check if not found
        if (!companyId) {
            const urlMatch = window.location.href.match(/companies\/(\d+)/);
            if (urlMatch) {
                companyId = urlMatch[1];
            }
        }
        
        // Fallback to page content check if still not found
        if (!companyId) {
            const htmlMatch = document.body.innerHTML.match(/auth\?company_id=(\d+)/);
            if (htmlMatch) {
                companyId = htmlMatch[1];
            }
        }

        if (companyId) {
            const baseUrl = window.location.origin;
            const newUrl = `${baseUrl}/${companyId}/company/admin/pdf_template_configuration`;
            window.open(newUrl, '_blank');
        } else {
            alert('Company ID not found on this page.');
        }
    }

    function navigateToContracts() {
        let companyId = null;
        
        // First try to get companyId from Procore.Environment
        if (window.Procore && window.Procore.Environment && window.Procore.Environment.companyId) {
            companyId = window.Procore.Environment.companyId;
        }
        
        // Fallback to URL check if not found
        if (!companyId) {
            const urlMatch = window.location.href.match(/companies\/(\d+)/);
            if (urlMatch) {
                companyId = urlMatch[1];
            }
        }
        
        // Fallback to page content check if still not found
        if (!companyId) {
            const htmlMatch = document.body.innerHTML.match(/auth\?company_id=(\d+)/);
            if (htmlMatch) {
                companyId = htmlMatch[1];
            }
        }

        if (companyId) {
            const baseUrl = window.location.origin;
            const newUrl = `${baseUrl}/${companyId}/company/admin/contracts`;
            window.open(newUrl, '_blank');
        } else {
            alert('Company ID not found on this page.');
        }
    }

    function navigateToSandbox() {
        // First try to get companyId from Procore.Environment
        let companyId = null;
        let projectNumber = null;
        
        // Try to get from Procore.Environment first
        if (window.Procore && window.Procore.Environment) {
            companyId = window.Procore.Environment.companyId;
            projectNumber = window.Procore.Environment.projectID;
        }
        
        // Find and click the project picker to open the dropdown
        const projectPicker = document.querySelector('[data-header="picker-company-project"]');
        if (projectPicker) {
            projectPicker.click();

            // Wait for the dropdown menu to appear and find the Sandbox project
            setTimeout(() => {
                const links = document.querySelectorAll('a');
                const sandboxLink = Array.from(links).find(link =>
                    link.textContent && link.textContent.toLowerCase().includes('sandbox')
                );

                if (sandboxLink) {
                    // Extract project number from the link href
                    const projectMatch = sandboxLink.href.match(/\/(\d+)\/project/);
                    if (projectMatch) {
                        projectNumber = projectMatch[1];
                    }
                }

                // If we still don't have companyId, try fallback methods
                if (!companyId) {
                    const urlMatch = window.location.href.match(/companies\/(\d+)/);
                    if (urlMatch) {
                        companyId = urlMatch[1];
                    }
                    
                    if (!companyId) {
                        const htmlMatch = document.body.innerHTML.match(/auth\?company_id=(\d+)/);
                        if (htmlMatch) {
                            companyId = htmlMatch[1];
                        }
                    }
                }

                if (companyId && projectNumber) {
                    const baseUrl = window.location.origin;
                    const newUrl = `${baseUrl}/webclients/host/companies/${companyId}/projects/${projectNumber}/tools/contracts/commitments`;
                    window.open(newUrl, '_blank');
                } else {
                    // If sandbox not found, ask user if they want to go to inactive projects
                    if (confirm('Could not find necessary information. Would you like to check the inactive projects page?')) {
                        if (companyId) {
                            const baseUrl = window.location.origin;
                            const newUrl = `${baseUrl}/${companyId}/company/home/list?filters%5Bbilling_status%5D=Inactive&sort%5Battribute%5D=name&sort%5Bdirection%5D=asc&search=`;
                            window.open(newUrl, '_blank');
                        } else {
                            alert('Company ID not found on this page.');
                        }
                    }
                }
            }, 500);
        } else {
            alert('Project picker not found on this page.');
        }
    }

    function navigateToProjectCustomFields() {
        let companyId = null;
        
        // First try to get companyId from Procore.Environment
        if (window.Procore && window.Procore.Environment && window.Procore.Environment.companyId) {
            companyId = window.Procore.Environment.companyId;
        }
        
        // Fallback to URL check if not found
        if (!companyId) {
            const urlMatch = window.location.href.match(/companies\/(\d+)/);
            if (urlMatch) {
                companyId = urlMatch[1];
            }
        }
        
        // Fallback to page content check if still not found
        if (!companyId) {
            const htmlMatch = document.body.innerHTML.match(/auth\?company_id=(\d+)/);
            if (htmlMatch) {
                companyId = htmlMatch[1];
            }
        }

        if (companyId) {
            const baseUrl = window.location.origin;
            const newUrl = `${baseUrl}/${companyId}/company/admin/custom_fields?class_name=project`;
            window.open(newUrl, '_blank');
        } else {
            alert('Company ID not found on this page.');
        }
    }

    // Dropdown button functions
    function dropdownButton1() {
        extractCompanyIdAndNavigate();
    }

    function dropdownButton2() {
        navigateToContracts();
    }

    function dropdownButton3() {
        navigateToSandbox();
    }

    function dropdownButton4() {
        navigateToProjectCustomFields();
    }

    // Edit BUTTONS here (name, placement)
    window.addEventListener('load', function() {
        addDropdownMenu('Navigation', [
            { text: 'Company > PDF Templates', onClickFunction: dropdownButton1 },
            { text: 'Sandbox Project', onClickFunction: dropdownButton3 },
            { text: 'Tools > Contracts', onClickFunction: dropdownButton2 },
            { text: 'Project > Custom Fields', onClickFunction: dropdownButton4 }
        ], '48px', '380px');
    });
})();