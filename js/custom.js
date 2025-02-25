
// Function to load and display photos
// function loadPhotos() {
//     const portfolioItem = document.querySelector(".portfolio_item");
//     if (!portfolioItem) return; // Skip if element doesn't exist
    
//     fetch("photos.html")
//         .then(response => response.text())
//         .then(data => {
//             portfolioItem.innerHTML = data;

//             // Re-run the image background script AFTER insertion
//             document.querySelectorAll(".main").forEach(el => {
//                 let imgUrl = el.getAttribute("data-img-url");
//                 if (imgUrl) {
//                     el.style.backgroundImage = `url('${imgUrl}')`;
//                     el.style.backgroundSize = "cover";
//                     el.style.backgroundPosition = "center";
//                     el.style.width = "100%";
//                 }
//             });
//         })
//         .catch(error => console.error("Error loading the photos:", error));
// }

function loadPhotos() {
    const portfolioItem = document.querySelector(".portfolio_item");
    if (!portfolioItem) return; // Skip if element doesn't exist
    
    fetch("photos.html")
        .then(response => response.text())
        .then(data => {
            portfolioItem.innerHTML = data;

            // Re-run the image background script AFTER insertion
            document.querySelectorAll(".main").forEach(el => {
                let imgUrl = el.getAttribute("data-img-url");
                if (imgUrl) {
                    el.style.backgroundImage = `url('${imgUrl}')`;
                    el.style.backgroundSize = "cover";
                    el.style.backgroundPosition = "center";
                    el.style.width = "100%";
                }
            });
            
            // Wait for images to load before triggering layout
            const images = portfolioItem.querySelectorAll('img');
            let imagesLoaded = 0;
            const totalImages = images.length;
            
            if (totalImages === 0) {
                initializeGrid(); // No images to wait for
            } else {
                // Check each image
                images.forEach(img => {
                    if (img.complete) {
                        imageLoaded();
                    } else {
                        img.addEventListener('load', imageLoaded);
                        img.addEventListener('error', imageLoaded); // Count failed images too
                    }
                });
            }
            
            function imageLoaded() {
                imagesLoaded++;
                if (imagesLoaded >= totalImages) {
                    // All images are loaded, now initialize the grid
                    initializeGrid();
                }
            }
            
            function initializeGrid() {
                console.log("Initializing photo grid...");
                
                // Method 1: Check if there's a filter "all" button and click it
                const allFilter = document.querySelector('.portfolio_filter a[data-filter="*"], .portfolio_filter a[data-filter="all"], .portfolio_filter .all');
                if (allFilter) {
                    allFilter.click();
                    console.log("Clicked 'all' filter button");
                    return; // If we successfully clicked the filter button, we're done
                }
                
                // Method 2: If using jQuery and isotope
                if (window.jQuery && jQuery.fn.isotope) {
                    const $grid = jQuery('.portfolio_list ul, .gallery_zoom');
                    $grid.isotope({
                        itemSelector: 'li',
                        layoutMode: 'fitRows',
                        percentPosition: true
                    });
                    console.log("Initialized Isotope grid");
                    return;
                }
                
                // Method 3: Manual layout adjustment - recalculate positions
                const listItems = portfolioItem.querySelectorAll('li');
                if (listItems.length > 0) {
                    // Force layout recalculation
                    listItems.forEach(item => {
                        // Temporarily hide and show to force browser to recalculate layout
                        const originalDisplay = item.style.display;
                        item.style.display = 'none';
                        // Force reflow
                        void item.offsetHeight;
                        item.style.display = originalDisplay;
                    });
                    
                    // Force browser reflow for the whole container
                    void portfolioItem.offsetHeight;
                    console.log("Applied manual layout recalculation");
                }
                
                // Method 4: Trigger a resize event which often helps with responsive layouts
                window.dispatchEvent(new Event('resize'));
                console.log("Triggered window resize event");
            }
        })
        .catch(error => console.error("Error loading the photos:", error));
}


// Function to load and highlight code blocks
// function loadCodeBlocks() {
//     const codeBlocks = document.querySelectorAll('code[data-src]');
//     if (codeBlocks.length === 0) return; // Skip if no code blocks
    
//     codeBlocks.forEach(codeBlock => {
//         const filePath = codeBlock.getAttribute('data-src');

//         fetch(filePath)
//             .then(response => response.text())
//             .then(code => {
//                 codeBlock.textContent = code;
//                 if (typeof Prism !== 'undefined') {
//                     Prism.highlightElement(codeBlock);
//                 }
//             })
//             .catch(error => console.error('Error loading code file:', error));
//     });
// }

// function loadCodeBlocks() {
//     const codeBlocks = document.querySelectorAll('code[data-src]');
//     if (codeBlocks.length === 0) return; // Skip if no code blocks

//     codeBlocks.forEach(codeBlock => {
//         let filePath = codeBlock.getAttribute('data-src');
        
//         // If the path is relative, adjust it based on the current HTML file's location
//         if (filePath && !filePath.startsWith('http') && !filePath.startsWith('https')) {
//             const currentPath = window.location.pathname; // Get the current file's path
//             const basePath = currentPath.substring(0, currentPath.lastIndexOf('/')); // Get folder of current file

//             // If the filePath is relative (doesn't start with '/'), resolve it to the base path
//             if (!filePath.startsWith('/')) {
//                 filePath = basePath + '/' + filePath; // Construct full relative path
//             }

//             // If the path starts with '/', it’s relative to the site root
//             if (filePath.startsWith('/')) {
//                 filePath = window.location.origin + filePath; // Make it absolute by adding base URL
//             }
//         }

//         // Fetch the file content
//         fetch(filePath)
//             .then(response => response.text())
//             .then(code => {
//                 codeBlock.textContent = code;
//                 if (typeof Prism !== 'undefined') {
//                     Prism.highlightElement(codeBlock);  // Highlight the code if Prism is available
//                 }
//             })
//             .catch(error => console.error('Error loading code file:', error));
//     });
// }



// // Function to load article content
// function loadArticles() {
//     const articleContainers = document.querySelectorAll('[id^="article_"]');
//     if (articleContainers.length === 0) return; // Skip if no articles
    
//     articleContainers.forEach(container => {
//         const articleId = container.id.replace('article_', '');
//         const articlePath = `/articles/article_${articleId}.html`;
        
//         fetch(articlePath)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`Article ${articleId} not found (${response.status})`);
//                 }
//                 return response.text();
//             })
//             .then(data => {
//                 container.innerHTML = data;
//             })
//             .catch(error => console.error(`Error loading article ${articleId}:`, error));
//     });
// }

/**
 * Article and Code Block Loading System
 * -------------------------------------
 * Handles loading articles dynamically and processing code blocks for syntax highlighting.
 */

// Combined function to load articles and their code blocks
function loadArticles() {
    const articleContainers = document.querySelectorAll('[id^="article_"]');
    if (articleContainers.length === 0) return; // Skip if no articles
    
    console.log(`Found ${articleContainers.length} articles to load`);
    
    // Track loaded articles for completion
    let loadedCount = 0;
    const totalArticles = articleContainers.length;
    
    articleContainers.forEach(container => {
        const articleId = container.id.replace('article_', '');
        const articlePath = `/articles/article_${articleId}.html`;
        
        console.log(`Loading article from: ${articlePath}`);
        
        fetch(articlePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Article ${articleId} not found (${response.status})`);
                }
                return response.text();
            })
            .then(data => {
                container.innerHTML = data;
                console.log(`Article ${articleId} loaded successfully`);
                
                // Process code blocks within this specific article container
                loadCodeBlocksInContainer(container);
                
                // Check if all articles are loaded
                loadedCount++;
                if (loadedCount === totalArticles) {
                    console.log('All articles loaded, processing any remaining code blocks');
                    // Process any remaining code blocks on the page (outside loaded articles)
                    loadCodeBlocksInContainer(document);
                }
            })
            .catch(error => {
                console.error(`Error loading article ${articleId}:`, error);
                container.innerHTML = `<div class="error-message">
                    <h3>Error Loading Article</h3>
                    <p>There was a problem loading this article. Please try again later.</p>
                    <p class="technical-details">Technical details: ${error.message}</p>
                </div>`;
                
                // Count failed loads too to maintain completion tracking
                loadedCount++;
                if (loadedCount === totalArticles) {
                    loadCodeBlocksInContainer(document);
                }
            });
    });
}

// Function to load code blocks within a specific container
function loadCodeBlocksInContainer(container) {
    const codeBlocks = container.querySelectorAll('code[data-src]');
    if (codeBlocks.length === 0) return; // Skip if no code blocks
    
    console.log(`Found ${codeBlocks.length} code blocks to load in container`);
    
    codeBlocks.forEach(codeBlock => {
        const filePath = codeBlock.getAttribute('data-src');
        console.log(`Loading code from: ${filePath}`);
        
        // Add loading indicator
        const originalContent = codeBlock.textContent || '// Code loading...';
        codeBlock.textContent = "Loading code...";
        
        // First try using fetch
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log(`Successfully fetched: ${filePath}`);
                return response.text();
            })
            .then(code => {
                codeBlock.textContent = code;
                if (typeof Prism !== 'undefined') {
                    Prism.highlightElement(codeBlock);
                } else if (window.hljs) {
                    hljs.highlightBlock(codeBlock);
                }
            })
            .catch(error => {
                console.warn(`Fetch failed for ${filePath}:`, error);
                
                // Try to adjust path if it might be a relative path issue
                const adjustedPath = attemptPathAdjustment(filePath, container);
                if (adjustedPath !== filePath) {
                    console.log(`Trying adjusted path: ${adjustedPath}`);
                    
                    fetch(adjustedPath)
                        .then(response => {
                            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                            return response.text();
                        })
                        .then(code => {
                            codeBlock.textContent = code;
                            if (typeof Prism !== 'undefined') {
                                Prism.highlightElement(codeBlock);
                            } else if (window.hljs) {
                                hljs.highlightBlock(codeBlock);
                            }
                        })
                        .catch(finalError => {
                            console.error(`All attempts failed for ${filePath}`, finalError);
                            codeBlock.textContent = `// Error loading code file: ${filePath}\n// ${finalError.message}\n\n${originalContent}`;
                        });
                } else {
                    // Fallback to XMLHttpRequest if fetch fails
                    console.log(`Trying XMLHttpRequest fallback for: ${filePath}`);
                    const xhr = new XMLHttpRequest();
                    
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                console.log(`XHR successful for: ${filePath}`);
                                codeBlock.textContent = xhr.responseText;
                                if (typeof Prism !== 'undefined') {
                                    Prism.highlightElement(codeBlock);
                                } else if (window.hljs) {
                                    hljs.highlightBlock(codeBlock);
                                }
                            } else {
                                console.error(`XHR failed with status ${xhr.status} for ${filePath}`);
                                codeBlock.textContent = `// Error loading code file: ${filePath}\n// Please ensure this page is served from a web server.\n\n${originalContent}`;
                            }
                        }
                    };
                    
                    xhr.open('GET', filePath, true);
                    xhr.send();
                    
                    xhr.onerror = function() {
                        console.error(`Network error with XHR for ${filePath}`);
                        codeBlock.textContent = `// Error loading code file: ${filePath}\n// Network error occurred.\n\n${originalContent}`;
                    };
                }
            });
    });
}

// Helper function to attempt to adjust the file path based on the context
function attemptPathAdjustment(originalPath, container) {
    if (originalPath.startsWith('./') || originalPath.startsWith('../')) {
        // Path is already relative, no adjustment needed
        return originalPath;
    }
    
    // Check if this is in an article container
    if (container.id && container.id.startsWith('article_')) {
        // For articles, we might need to adjust the path
        return `../examples/code/${originalPath}`; // Adjust this based on your folder structure
    }
    
    // Default, no adjustment
    return originalPath;
}

// Add warning about server requirements if using file protocol
function checkProtocolAndWarn() {
    if (window.location.protocol === 'file:') {
        console.warn('Running from file:// protocol. Code loading may fail due to browser security restrictions.');
        
        const warningDiv = document.createElement('div');
        warningDiv.style.cssText = 'background-color: #fff3cd; color: #856404; padding: 10px; margin: 15px 0; border-radius: 4px; border-left: 5px solid #ffeeba;';
        warningDiv.innerHTML = '<strong>Note:</strong> For code highlighting to load properly, this page should be viewed through a web server rather than from the file system.';
        
        // Add after header or as first element in the content area
        const contentArea = document.querySelector('.container') || document.body;
        const header = document.querySelector('header');
        
        if (header && header.nextElementSibling) {
            contentArea.insertBefore(warningDiv, header.nextElementSibling);
        } else {
            contentArea.insertBefore(warningDiv, contentArea.firstChild);
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // 1. Load photos
    loadPhotos();
    
    // 2. Load code blocks
    loadCodeBlocks();
    
    // 3. Load articles
    loadArticles();
});


// Document ready handler
function documentReady() {
    // Initialize article loading (which will handle code blocks)
    loadArticles();
    
    // Check for file protocol issues
    checkProtocolAndWarn();
    
    // Check for any code blocks on the main page not in articles
    if (document.querySelectorAll('[id^="article_"]').length === 0) {
        loadCodeBlocksInContainer(document);
    }
    
    // Any other initialization code you already have...
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', documentReady);
} else {
    // DOM is already loaded, call directly
    documentReady();
}
