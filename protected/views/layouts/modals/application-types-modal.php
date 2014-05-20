<div id="application-type-modal" class="dialog-box module" style="display:none;">
    <div class="dialog-container">
        <div class="dialog-content">
            <form action="">
                <div class="dialog-content-block">
                    <div class="form module">
                        <input type="hidden" id="application-type-modal-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
                        <input id="application-type-input" type="text"/>
                        <div class="small-scroller">
                            <table>
                                <tbody id="application-type-table">
                                </tbody>
                            </table>
                        </div>
                        <div class="dialog-footer-block" style="margin-top:0px;">
                            <div class="field field-text" style="margin:0px;">
                                <div class="field-action-content">
                                    <div class="pseudo-field pseudo-button">
                                        <a id="application-type-modal-cancel-button" class="cancel" href="#">Cancel</a>
                                    </div>
                                    <div class="pseudo-field pseudo-button primary-button">
                                        <button id="application-type-modal-confirm-button" disabled>Select</button>
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