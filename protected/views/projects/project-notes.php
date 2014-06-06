<!-- LIST PROJECT NOTES -->
<div id="project-notes-list">
    <form>
        <input type="hidden" id="project-notes-list-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <!-- header -->
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Notes</b></h3>&nbsp&nbsp
                    <a id="project-notes-list-create-button" href="#">[Add]</a>
                </div>
            </div>
            <!-- body -->
            <div id="edit-primary-content" class="content">
                <div class="height-limiter">
                    <table>
                        <tbody id="project-notes-list-table">
                        </tbody>
                    </table>
                </div>
                <a style="float:left;margin-top:5px;"></a>
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="project-notes-list-part"></span>
                        <span class="all-page" id="project-notes-list-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="project-notes-list-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="project-notes-list-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>

<!-- CREATE PROJECT NOTES -->
<div id="project-notes-create" style="display:none;" class="contact-info plain-list">
    <form>
        <input type="hidden" id="project-notes-create-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header"><h3><b>Add Note</b></h3></div>
            </div>
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-primary" style="width:98%;">
                        <div class="pseudo-field">
                        <textarea rows="8" id="project-notes-create-notes" class="text"></textarea>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="project-notes-create-cancel-button" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="project-notes-create-save-button">Create</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
        </div>
    </form>
</div>