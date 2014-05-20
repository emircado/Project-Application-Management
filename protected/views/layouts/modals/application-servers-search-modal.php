<div id="app-servers-search-modal" class="dialog-box module" style="display:none;">
    <div class="dialog-container">
        <div class="dialog-content">
            <form action="">
                <div class="dialog-content-block">
                    <div class="form module">
                        <input type="hidden" id="app-servers-modal-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
                        <input id="app-servers-search-input" type="text"/>
                        <div class="small-scroller">
                            <table>
                                <tbody id="app-servers-search-table" >
                                </tbody>
                            </table>
                        </div>
                        <div class="dialog-footer-block" style="margin-top:0px;">
                            <div class="field field-text" style="margin:0px;">
                                <div class="field-action-content">
                                    <div class="pseudo-field pseudo-button">
                                        <a id="app-servers-search-modal-cancel-button" class="cancel" href="#">Cancel</a>
                                    </div>
                                    <div class="pseudo-field pseudo-button primary-button">
                                        <button id="app-servers-search-modal-confirm-button">Select</button>
                                    </div>
                                </div><!-- End Field Action Content -->
                            </div><!-- End Field Action -->
                        </div><!-- End UI Dialog Footer Block -->
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>