export default function decorate(block) {

    block.setAttribute('data-item-length', block.children.length);

    let rowId = 0;
    [...block.children].forEach(row => {
        const DEFAULT_DISPLAY_DURATION = 5000;//5 ms
        row.setAttribute('style', 'display:none');
        row.setAttribute('data-item-id', ++rowId);
        [...row.children].forEach(column => {
            if (column.innerText.toLowerCase() === 'image') {
                column.setAttribute('hidden', true);
                row.setAttribute('data-item-duration', DEFAULT_DISPLAY_DURATION);
                row.setAttribute('data-type', 'image');
            } else if (column.innerText.toLowerCase() === 'video') {
                column.setAttribute('hidden', true);
                let videoParent = document.createElement('div');
                let videoElement = document.createElement('video');
                videoElement.id = 'video-id-' + row.getAttribute('data-item-id');
                videoElement.src = column.nextElementSibling.firstElementChild.innerText;
                videoElement.muted = true;
                videoElement.playsInline = true;
                videoElement.addEventListener('ended', function() {
                    displayNextVisibleItem();
                });
                videoParent.appendChild(videoElement);
                column.nextElementSibling.remove();
                row.appendChild(videoParent);
                row.setAttribute('data-type', 'video');
            }
        })
    });

    displayNextVisibleItem();

    function displayNextVisibleItem() {
        if (block.children.length <= 0) {
            return;
        }
        let nextVisibleItem = findNextVisibleItem();
        if (!nextVisibleItem) {
            nextVisibleItem = block.firstElementChild;
        }
        nextVisibleItem.setAttribute('style', 'display:block');
        if (nextVisibleItem.getAttribute('data-type') === 'video') {
            const videoElem = document.getElementById('video-id-' + nextVisibleItem.getAttribute('data-item-id'));
            videoElem.play();
        }
        let duration = nextVisibleItem.getAttribute('data-item-duration');
        if (duration) {
            setTimeout(() => {
                displayNextVisibleItem();
            }, duration);
        }
    }

    function findNextVisibleItem() {
        let visibleItem = [...block.children].find((row) => row.getAttribute('style') === 'display:block');
        if (visibleItem) {
            visibleItem = visibleItem.nextElementSibling;
            const itemId = visibleItem ? visibleItem.getAttribute('data-item-id'): -1;
            //make sure all other items are hidden
            [...block.children].forEach(row => {
                if (row.getAttribute('data-item-id') != itemId) {
                    row.setAttribute('style', 'display:none');
                }
            });
        }
        return visibleItem;
    }

}
