<!-- LIST APPLICATION NOTES -->
<div id="application-notes-list">
    <form>
        <input type="hidden" id="application-notes-list-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <!-- header -->
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Notes</b></h3>&nbsp&nbsp
                    <a id="application-notes-list-create-button" href="#">[Add]</a>
                </div>
            </div>
            <!-- body -->
            <div id="edit-primary-content" class="content">
                <div class="height-limiter">
                    <table>
                        <tbody id="application-notes-list-table" class="notes-table">
                        </tbody>
                    </table>
                </div>
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="application-notes-list-part"></span>
                        <span class="all-page" id="application-notes-list-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="application-notes-list-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="application-notes-list-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>

<!-- CREATE APPLICATION NOTES -->
<div id="application-notes-create" style="display:none;" class="contact-info plain-list">
    <form>
        <input type="hidden" id="application-notes-create-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header"><h3><b>Add Note</b></h3></div>
            </div>
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-primary" style="width:98%;">
                        <div class="pseudo-field">
                        <textarea rows="8" id="application-notes-create-notes" class="text"></textarea>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="application-notes-create-cancel-button" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="application-notes-create-save-button">Create</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
        </div>
    </form>
</div>